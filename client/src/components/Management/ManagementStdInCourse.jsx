import { useState,useEffect } from "react";
import { useSelector } from "react-redux";
import { FaPlus, FaTrash, FaRegEdit } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
//function
import {createStudentInCourse, readStudentInCourseByCourse_id,readAllStudentInCourse,deleteStudentInCourse}from "../../api/std_reg_courseApi"
import {readAllCourse}from "../../api/courseApi"
//Ant เเจ้ง Alert
import { message } from 'antd';

const ManagementStdInCourse = () => {
  const user = useSelector(state => state.auth.user)
  const [std_code, setStd_code] = useState("");
  const [course_id, setCourse_id] = useState("");
 

//fetch Course_id มาเป็น value ใน input 
const [SelectCourse_id, setSelectCourse_id] = useState([]);
useEffect(() => {
  readAllCourse(user.token)
    .then((res) => {
      setSelectCourse_id(res.data);
    })
    .catch((err) => {
      console.log(err.response.data);
    });
}, []);

  
//------------------------------------------cerate Course--------------------------------------------

//createModal
const [showModal, setShowModal] = useState(false);
const handleModalClose = () => setShowModal(false);
const handleModalShow = () => setShowModal(true);

const handleSubmit = async (e) => {
  e.preventDefault();
  const newPost = {
    std_code,
    course_id,
  };
  createStudentInCourse(user.token, newPost)
    .then((res) => {
      console.log(res.data);
      loadData(user.token);
      handleModalClose();
      //alert("create Student In Course Success");
      message.success('create Student In Course Success');  
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};
//------------------------------------------readAllStudentInCourse and loadData---------------------------------
 
const [data, setData] = useState([]);         
 const loadData = (authtoken) => { 
  readAllStudentInCourse(authtoken)
     .then((res) => {
       setData(res.data);   
     })
     .catch((err) => {
       //console.log(err.response.data); 
     });
 };
 useEffect(() => {       
   loadData(user.token);  
 }, []);


 //ถ้าเลือกคอร์สจะ fetch อันนี้เเทน
 const loadStudentsByCourseId = (courseId) => {
  readStudentInCourseByCourse_id(user.token, courseId)
    .then((res) => {
      setData(res.data);
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};

//------------------------------------------deleteStudentInCourse---------------------------------------------
  const handleRemove = (sid,cid) => {
    if (window.confirm("Are You Sure Delete!!")) { 
      deleteStudentInCourse(user.token, sid,cid)                   
        .then((res) => {                           
          console.log(res);
          loadData(user.token);
          message.success('Delete Student In Course Success');                
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  return (
    <div className="container-main-noborder">
      <h3 className='big-title py-3'>จัดการข้อมูล</h3>
      <div className="d-flex justify-content-start align-items-center">
        <h3 className="title">ข้อมูลนักศึกษาในคอร์ส</h3>
        <button className="btn-manage ms-2" onClick={() => handleModalShow()}>
          <FaPlus /> เพิ่มข้อมูล
        </button>
      </div>
      <div className="mt-3 mb-1">
        <label htmlFor="Course_id" className="title2 me-2">
          คอร์ส :
          </label>
            <select
              className="ms-2"
              name="Course_id"
              onChange={(e) => {loadStudentsByCourseId(e.target.value);}}
            >
              <option value="">คอร์สทั้งหมด</option>
              {SelectCourse_id.map((item, index) => (
                <option key={index} value={item.course_id}>
                  {item.subj_name}
                </option>
              ))}
            </select>
      </div>

      <div className="py-2 "style={{ maxHeight: '500px', overflowY: 'auto' }} >
        <table className="table table-bordered shadow custom-table" >
          <thead>
            <tr>
            <th className="titleTh text-center" scope="col">รหัสวิชา</th>
              <th className="titleTh text-center" scope="col">รหัสนักศึกษา</th>
              <th className="titleTh text-center" scope="col">ชื่อนักศึกษา</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody >
            {data.map((item,index)=>(
            <tr key={index}>
              <td className="titleTd text-center">{item.subj_code}</td>
              <td className="titleTd text-center">{item.std_code}</td>
              <td className="titleTd text-center">{item.std_name}</td>
              <td className="titleTd text-center">
                <button className="btn-trash" onClick={() => handleRemove(item.std_code,item.course_id)} >
                  <FaTrash /> ลบ
                </button>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* MODAL เพิ่มข้อมูล */}
      <Modal show={showModal} onHide={handleModalClose} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            <h3 className="titleModal">เพิ่มข้อมูลนักศึกษาในคอร์ส</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container ">
            <form className="m-5">
              <div className="form-group mt-3">
                <h3>รหัสนักศึกษา</h3>
                <input
                  className="form-control"
                  type="text"
                  name="std_code"
                  onChange={(e) => setStd_code(e.target.value)}
                />
              </div>

              <div className="form-group mt-3">
                <h3>คอร์ส</h3>
                  <select
                  className="form-control"
                  name="Course_id"
                  onChange={(e) => setCourse_id(e.target.value)}
                >
                  <option value="">เลือกคอร์ส</option>
                  {SelectCourse_id.map((item, index) => (
                    <option key={index} value={item.course_id}>
                      {item.subj_name}
                    </option>
                  ))}
                </select>
              </div>

            </form>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center w-100">
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>



    </div>
  );
};

export default ManagementStdInCourse;
