import { useState,useEffect } from "react";
import { useSelector } from "react-redux";
import { FaPlus, FaTrash, FaRegEdit } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
//function
import {createLecturer,readAllLecturer,updateLecturer,deleteLecturer}from "../../api/lecturerApi"
//Ant เเจ้ง Alert
import { message } from 'antd';


const ManagementLecturer = () => {
  const user = useSelector(state => state.auth.user)
  const [lect_id, setLect_id] = useState("");
  const [lect_name, setLect_name] = useState("");
  
  
//------------------------------------------cerate room--------------------------------------------
//createModal
const [showModal, setShowModal] = useState(false);
const handleModalClose = () => setShowModal(false);
const handleModalShow = () => setShowModal(true);

const handleSubmit = async (e) => {
  e.preventDefault();
  const newPost = {
    lect_id,
    lect_name,
  };
  createLecturer(user.token, newPost)
    .then((res) => {
      console.log(res.data);
      loadData(user.token);
      handleModalClose();
      //alert("create Lecturer Success");
      message.success('create Lecturer Success');  
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};
//------------------------------------------readAllLecturer and loadData---------------------------------
 const [data, setData] = useState([]);         
 const loadData = (authtoken) => { 
  readAllLecturer(authtoken)
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
//------------------------------------------updateRoom-------------------------------------------
  //editModal 
  const [editModal, setEditModal] = useState(false);
  const [values, setValues] = useState({
    lect_id: "",
    lect_name: ""
  });
  const showEditModal = (room) => {
    setValues({
      lect_id: room.lect_id,
      lect_name: room.lect_name
    });
    setEditModal(true);
  };
  const handleEdit = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateLecturer(user.token, values.lect_id, values)
      .then((res) => {
        //alert("Update Lecturer Success");
        message.success('Update Lecturer Success');
        loadData(user.token);
        setEditModal(false);
      })
      .catch((err) => console.log(err.response.data));
  };
//------------------------------------------deleteLecturer---------------------------------------------
  const handleRemove = (id) => {
    if (window.confirm("Are You Sure Delete!!")) { 
      deleteLecturer(user.token, id)                   
        .then((res) => {                           
          console.log(res);
          loadData(user.token);
          message.success('Delete Lecturer Success');               
        })
        .catch((err) => {
          //console.log(err.response);
          message.error("ไม่สามารถลบได้ เนื่องจากอาจารคนนี้มีชื่อใช้งานในระบบอยู่");
        });
    }
  };

  return (
    <div className="container-main-noborder">
      <h3 className='big-title py-3'>จัดการข้อมูล</h3>
      <div className="d-flex justify-content-start align-items-center">
        <h3 className="title">ข้อมูลอาจารย์</h3>
        <button className="btn-manage ms-2" onClick={() => handleModalShow()}>
          <FaPlus /> เพิ่มข้อมูล
        </button>
      </div>

      <div className="py-2" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="table table-bordered shadow custom-table">
          <thead>
            <tr>
              <th className="titleTh text-center" scope="col">รหัสประจำตัว</th>
              <th className="titleTh text-center" scope="col">ชื่อ-นามสกุลอาจารย์</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item,index)=>(
            <tr key={index}>
              <td className="titleTd text-center">{item.lect_id}</td>
              <td className="titleTd text-center">{item.lect_name}</td>
              <td className="titleTd text-center">
                <button className="btn-edit me-3" onClick={() => showEditModal(item)}>
                  <FaRegEdit /> เเก้ไข
                </button>
                <button className="btn-trash me-3" onClick={() => handleRemove(item.lect_id)} >
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
            <h3 className="titleModal">เพิ่มข้อมูลอาจารย์</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container ">
            <form className="m-5">
              <div className="form-group mt-3">
                <h3>รหัสประจำตัว</h3>
                <input
                  className="form-control"
                  type="text"
                  name="lect_id"
                  onChange={(e) => setLect_id(e.target.value)}
                />
              </div>

              <div className="form-group mt-3">
                <h3>ชื่อ-นามสกุลอาจารย์</h3>
                <input
                  className="form-control"
                  type="text"
                  name="lect_name"
                  onChange={(e) => setLect_name(e.target.value)}
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
      <h3 className="titleModal">แก้ไขข้อมูลอาจารย์ </h3>
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="container">
      <form className="m-5" onSubmit={handleEditSubmit}>
        <div className="form-group">
          <h3>รหัสประจำตัว</h3>
          <input
            className="form-control"
            type="text"
            name="lect_id"
            value={values.lect_id}
            onChange={handleEdit}
          />
        </div>
        <div className="form-group mt-3">
          <h3>ชื่อ-นามสกุลอาจารย์</h3>
          <input
            className="form-control"
            type="text"
            name="lect_name"
            value={values.lect_name}
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

export default ManagementLecturer;
