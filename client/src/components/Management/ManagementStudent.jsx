import { useState,useEffect } from "react";
import { useSelector } from "react-redux";
import { FaPlus, FaTrash, FaRegEdit } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
//function
import {createStudent,readAllStudent,updateStudent,deleteStudent}from "../../api/studentApi"
import { readAllMajor}from "../../api/majorApi"
//Ant เเจ้ง Alert
import { message } from 'antd';



const ManagementStudent = () => {
  const user = useSelector(state => state.auth.user)
  const [std_code, setStd_code] = useState("");
  const [major_id, setMajor_id] = useState("");
  const [std_name, setStd_name] = useState("");


//fetch major มาเป็น value ใน input 
const [SelectMajor_id, setSelectMajor_id] = useState([]);
useEffect(() => {
  readAllMajor()
    .then((res) => {
      setSelectMajor_id(res.data);
    })
    .catch((err) => {
      console.log(err.response.data);
    });
}, []);




//------------------------------------------cerate Student--------------------------------------------
//createModal
const [showModal, setShowModal] = useState(false);
const handleModalClose = () => {
  setShowModal(false);
  setErrors({});
};
const handleModalShow = () => setShowModal(true);

//Validation
const validateFormCreateStd = () => {
  let valid = true;
  const newErrors = {};
  // Validate std_code
  if (!std_code) {
    newErrors.std_code = "โปรดระบุรหัสนักศึกษา";
    valid = false;
  }
  // Validate major_id
  if (!major_id) {
    newErrors.major_id = "โปรดระบุสาขา";
    valid = false;
  }
  // Validate std_name
  if (!std_name) {
    newErrors.std_name = "โปรดระบุชื่อนักศึกษา";
    valid = false;
  }
  setErrors(newErrors);
  return valid;
};

const handleSubmit = async (e) => {
  e.preventDefault();
 
  if(validateFormCreateStd()){
    const value= {
      std_code,
      major_id,
      std_name,
    };
  createStudent(user.token, value)
    .then((res) => {
      console.log(res.data);
      loadData(user.token);
      handleModalClose();
      //alert("create Student Success"); 
      message.success('create Student Success');
    })
    .catch((err) => {
      //console.log(err.response.data);
      message.error("มีนักศึกษาคนนี้อยู่ในระบบเเล้ว");
      setStd_code("")
      setStd_name("")
      setMajor_id("")
    });
  }
};
//------------------------------------------readAllStudent and loadData---------------------------------

const [data, setData] = useState([]);         
 const loadData = (authtoken) => { 
  readAllStudent(authtoken)
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

 
//------------------------------------------updateStudent-------------------------------------------
  
//editModal 
  const [editModal, setEditModal] = useState(false);
  const handleEditModalClose = () => {
    setEditModal(false);
    setErrors({});
  };


  const [values, setValues] = useState({
    std_code: "",
    major_id: "",
    std_name: "",
  });
  const [errors, setErrors] = useState({});
  
  //Validation
  const validateForm = () => {
    let valid = true;
    const newErrors = {};
    // Validate std_code
    if (!values.std_code) {
      newErrors.std_code = "โปรดระบุรหัสนักศึกษา";
      valid = false;
    }
    // Validate major_id
    if (!values.major_id) {
      newErrors.major_id = "โปรดระบุสาขา";
      valid = false;
    }
    // Validate std_name
    if (!values.std_name) {
      newErrors.std_name = "โปรดระบุชื่อนักศึกษา";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const showEditModal = (student) => {
    setValues({
      std_code: student.std_code,
      major_id: student.major_id,
      std_name: student.std_name,
    });
    setEditModal(true);
  };
  const handleEdit = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if(validateForm()){
    updateStudent(user.token, values.std_code, values)
      .then((res) => {
        //alert("Update Student Success");
        message.success('Update Student Success');
        loadData(user.token);
        setEditModal(false);
      })
      .catch((err) => console.log(err.response.data));
    }
  };
//------------------------------------------deleteStudent---------------------------------------------
  const handleRemove = (id) => {
    if (window.confirm("Are You Sure Delete!!")) { 
      deleteStudent(user.token, id)                   
        .then((res) => {                           
          console.log(res);
          loadData(user.token);
          message.success('Delete Student Success');               
        })
        .catch((err) => {
          //console.log(err.response);
          message.error("ไม่สามารถลบได้ เนื่องจากนักศึกษาคนนี้มีชื่อลงทะเบียนเรียนอยู่");
        });
    }
  };

  return (
    <div className="container-main-noborder">
      <h3 className='big-title py-3'>จัดการข้อมูล</h3>
      <div className="d-flex justify-content-start align-items-center">
          <h3 className="title">ข้อมูลนักศึกษา</h3>
          <button className="btn-manage ms-2" onClick={() => handleModalShow()}>
            <FaPlus /> เพิ่มข้อมูล
          </button>
      </div>
      
      <div className="py-2" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="table table-bordered shadow custom-table">
          <thead>
            <tr>
              <th className="titleTh text-center" scope="col">รหัสประจำตัว</th>
              <th className="titleTh text-center" scope="col">ชื่อ-นามสกุล</th>
              <th className="titleTh text-center" scope="col">สาขา</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item,index)=>(
            <tr key={index}>
              <td className="titleTd text-center">{item.std_code}</td>
              <td className="titleTd text-center">{item.std_name}</td>
              <td className="titleTd text-center">{item.major_name}</td>
              <td className="text-center">
                <button className="btn-edit me-3" onClick={() => showEditModal(item)}>
                  <FaRegEdit /> เเก้ไข
                </button>
                <button className="btn-trash me-3" onClick={() => handleRemove(item.std_code)} >
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
                <h3>รหัสประจำตัว</h3>
                <input
                  className="form-control"
                  type="text"
                  name="std_code"
                  onChange={(e) => setStd_code(e.target.value)}
                />
              </div>
              {errors.std_code && (
                <span className="text-danger m-t-3">{errors.std_code}</span>
              )}

              <div className="form-group mt-3">
                <h3>ชื่อ-นามสกุล</h3>
                <input
                  className="form-control"
                  type="text"
                  name="std_name"
                  onChange={(e) => setStd_name(e.target.value)}
                />
              </div>
              {errors.std_name && (
                <span className="text-danger m-t-3">{errors.std_name}</span>
              )}

              <div className="form-group mt-3">
                <h3>สาขา</h3>
                 <select
                  className="form-control"
                  name="major_id"
                  onChange={(e) => setMajor_id(e.target.value)} 
                >
                  <option value="">เลือก...</option>
                  {SelectMajor_id.map((item, index) => (
                    <option key={index} value={item.major_id}>
                      {item.major_name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.major_id && (
                <span className="text-danger m-t-3">{errors.major_id }</span>
              )}

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
  <Modal show={editModal} onHide={handleEditModalClose} className="custom-modal">
  <Modal.Header closeButton>
    <Modal.Title className="text-center w-100">
      <h3 className="titleModal">แก้ไขข้อมูลวิชา {values.std_code}</h3>
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
            name="std_code"
            value={values.std_code}
            onChange={handleEdit}
          />
        </div>
        {errors.std_code && (
                <span className="text-danger m-t-3">{errors.std_code}</span>
              )}
        <div className="form-group mt-3">
          <h3>ชื่อ-นามสกุล</h3>
          <input
            className="form-control"
            type="text"
            name="std_name"
            value={values.std_name}
            onChange={handleEdit}
          />
        </div>
        {errors.std_name && (
                <span className="text-danger m-t-3">{errors.std_name}</span>
          )}
        <div className="form-group mt-3">
          <h3>สาขา</h3>
          <select
            className="form-control"
            name="major_id"
            onChange={handleEdit} 
            >
            <option value="">เลือก...</option>
            {SelectMajor_id.map((item, index) => (
              <option key={index} value={item.major_id}>
                {item.major_name}
              </option>
            ))}
          </select>
        </div>
        {errors.major_id && (
                <span className="text-danger m-t-3">{errors.major_id}</span>
          )}
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

export default ManagementStudent;
