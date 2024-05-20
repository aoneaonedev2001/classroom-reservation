import { useState,useEffect } from "react";
import { useSelector } from "react-redux";
import { FaPlus, FaTrash, FaRegEdit } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
//function
import {createSubject,readAllSubject,updateSubject,deleteSubject}from "../../api/subjectApi"
//Ant เเจ้ง Alert
import { message } from 'antd';


const ManagementSubject = () => {
  const user = useSelector(state => state.auth.user)
  const [subj_code, setSubj_code] = useState("");
  const [subj_name, setSubj_name] = useState("");
  
  
//------------------------------------------cerate Subject--------------------------------------------
//createModal
const [showModal, setShowModal] = useState(false);
const handleModalClose = () => setShowModal(false);
const handleModalShow = () => setShowModal(true);

const handleSubmit = async (e) => {
  e.preventDefault();
  const newPost = {
    subj_code,
    subj_name,
  };
  createSubject(user.token, newPost)
    .then((res) => {
      console.log(res.data);
      loadData(user.token);
      handleModalClose();
      //alert("create Subject Success");
      message.success('create Subject Success'); 
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};
//------------------------------------------readAllSubject and loadData---------------------------------
 const [data, setData] = useState([]);         
 const loadData = (authtoken) => { 
  readAllSubject(authtoken)
     .then((res) => {
       setData(res.data);   
     })
     .catch((err) => {
       console.log(err.response.data); 
     });
 };
 useEffect(() => {       
   loadData(user.token);  
 }, []);
//------------------------------------------updateSubject-------------------------------------------
  //editModal 
  const [editModal, setEditModal] = useState(false);
  const [values, setValues] = useState({
    subj_code: "",
    subj_name: "",
  });
  const showEditModal = (subject) => {
    setValues({
      subj_code: subject.subj_code,
      subj_name: subject.subj_name,
    });
    setEditModal(true);
  };
  const handleEdit = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateSubject(user.token, values.subj_code, values)
      .then((res) => {
        //alert("Update Subject Success");
        message.success('Update Subject Success'); 
        loadData(user.token);
        setEditModal(false);
      })
      .catch((err) => console.log(err.response.data));
  };
//------------------------------------------deleteSubject---------------------------------------------
  const handleRemove = (id) => {
    if (window.confirm("Are You Sure Delete!!")) { 
      deleteSubject(user.token, id)                   
        .then((res) => {                           
          console.log(res);
          loadData(user.token);
          message.success('Delete Subject Success');               
        })
        .catch((err) => {
          //console.log(err.response);
          message.error("ไม่สามารถลบได้ เนื่องจากชื่อวิชานี้ถูกใช้งานอ้างอิงใน Course อยู่");
        });
    }
  };

  return (
    <div className="container-main-noborder">
      <h3 className='big-title py-3'>จัดการข้อมูล</h3>
      <div className="d-flex justify-content-start align-items-center">
        <h3 className="title">ข้อมูลวิชา</h3>
        <button className="btn-manage ms-2" onClick={() => handleModalShow()}>
          <FaPlus /> เพิ่มข้อมูล
        </button>
      </div>

      <div className="py-2" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="table table-bordered shadow custom-table">
          <thead>
            <tr>
              <th className="titleTh text-center" scope="col">รหัสวิชา</th>
              <th className="titleTh text-center" scope="col">ชื่อวิชา</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item,index)=>(
            <tr key={index}>
              <td className="titleTd text-center">{item.subj_code}</td>
              <td className="titleTd text-center">{item.subj_name}</td>
              <td className="titleTd text-center">
                <button className="btn-edit me-3" onClick={() => showEditModal(item)}>
                  <FaRegEdit /> เเก้ไข
                </button>
                <button className="btn-trash me-3" onClick={() => handleRemove(item.subj_code)} >
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
            <h3 className="titleModal">เพิ่มข้อมูลวิชา</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container ">
            <form className="m-5">
              <div className="form-group mt-3">
                <h3>รหัสวิชา</h3>
                <input
                  className="form-control"
                  type="text"
                  name="subj_code"
                  onChange={(e) => setSubj_code(e.target.value)}
                />
              </div>

              <div className="form-group mt-3">
                <h3>ชื่อวิชา</h3>
                <input
                  className="form-control"
                  type="text"
                  name="subj_name"
                  onChange={(e) => setSubj_name(e.target.value)}
                />
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

    
      {/* MODAL เเก้ไขข้อมูล */}
  <Modal show={editModal} onHide={() => setEditModal(false)} className="custom-modal">
  <Modal.Header closeButton>
    <Modal.Title className="text-center w-100">
      <h3 className="titleModal">แก้ไขข้อมูลวิชา {values.subj_code}</h3>
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="container">
      <form className="m-5" onSubmit={handleEditSubmit}>
        <div className="form-group">
          <h3>รหัสวิชา</h3>
          <input
            className="form-control"
            type="text"
            name="subj_code"
            value={values.subj_code}
            onChange={handleEdit}
          />
        </div>
        <div className="form-group mt-3">
          <h3>ชื่อวิชา</h3>
          <input
            className="form-control"
            type="text"
            name="subj_name"
            value={values.subj_name}
            onChange={handleEdit}
          />
        </div>
      </form>
    </div>
  </Modal.Body>
  <Modal.Footer className="d-flex justify-content-center w-100">
    <Button variant="secondary" onClick={() => setEditModal(false)}>
      Close
    </Button>
    <Button variant="primary" type="submit" onClick={handleEditSubmit}>
      Submit
    </Button>
  </Modal.Footer>
</Modal>


    </div>
  );
};

export default ManagementSubject;
