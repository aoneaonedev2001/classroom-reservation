import { useState,useEffect } from "react";
import { useSelector } from "react-redux";
import { FaPlus, FaTrash, FaRegEdit } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
//function
import {createUser,readAllUser,updateUser,deleteUser}from "../../api/userApi"
//Ant เเจ้ง Alert
import { message } from 'antd';

const ManagementUser = () => {
  const user = useSelector(state => state.auth.user)
  const [user_id, setUser_id] = useState("");
  const [password, setPassword] = useState("");
  const [user_name, setUser_name] = useState("");
  const [role, setRole] = useState("");
  
  
//------------------------------------------cerate User--------------------------------------------
//createModal
const [showModal, setShowModal] = useState(false);
const handleModalClose = () => {
  setShowModal(false);
  setErrors({});
};
const handleModalShow = () => setShowModal(true);

const [errors, setErrors] = useState({});
  // Validation for create user modal
  const validateFormCreateUser = () => {
    let valid = true;
    const newErrors = {};
    // Validate roomtype_id
    if (!user_id) {
      newErrors.user_id = "โปรดระบุ username";
      valid = false;
    }
    // Validate room_id
    if (!user_name) {
      newErrors.user_name= "โปรดระบุ ชื่อ-นามสกุล";
      valid = false;
    }
    // Validate capacity
    if (!password) {
      newErrors.password = "โปรดระบุรหัสผ่าน";
      valid = false;
    }
    // Validate building
    if (!role) {
      newErrors.role = "โปรดระบุ สถานะuser";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  if(validateFormCreateUser()){
  const newPost = {
    user_id,
    password,
    user_name,
    role
  };
  createUser(user.token, newPost)
    .then((res) => {
      console.log(res.data);
      loadData(user.token);
      handleModalClose();
      //alert("create User Success");
      message.success('create User Success'); 
    })
    .catch((err) => {
      console.log(err.response.data);
    });
  }
};
//------------------------------------------readAllUser and loadData---------------------------------
 const [data, setData] = useState([]);         
 const loadData = (authtoken) => { 
  readAllUser(authtoken)
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
//------------------------------------------updateUser-------------------------------------------
  //editModal 
  const [editModal, setEditModal] = useState(false);
  const [values, setValues] = useState({
    user_id: "",
    password: "",
    user_name: "",
    role:"",
  });
  const showEditModal = (User) => {
    setValues({
      user_id: User.user_id,
      password: User.password,
      user_name: User.user_name,
      role: User.role,
    });
    setEditModal(true);
  };
  const handleEdit = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateUser(user.token, values)
      .then((res) => {
        //alert("Update User Success");
        message.success('Update User Success'); 
        loadData(user.token);
        setEditModal(false);
      })
      .catch((err) => console.log(err.response.data));
  };
//------------------------------------------deleteUser---------------------------------------------
  const handleRemove = (id) => {
    if (window.confirm("Are You Sure Delete!!")) { 
      deleteUser(user.token, id)                   
        .then((res) => {                           
          console.log(res);
          loadData(user.token);
          message.success('Delete User Success');                
        })
        .catch((err) => {
          console.log(err.response);
          message.error("ไม่สามารถลบได้ เนื่องจาก userถูกใช้งานอยู่");
        });
    }
  };

  return (
    <div className="container-main-noborder">
      <h3 className='big-title py-3'>จัดการข้อมูล</h3>
      <div className="d-flex justify-content-start align-items-center">
        <h3 className="title">จัดการข้อมูลผู้ใช้</h3>
        <button className="btn-manage ms-2" onClick={() => handleModalShow()}>
          <FaPlus /> เพิ่มข้อมูล
        </button>
      </div>

      <div className="py-2" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="table table-bordered shadow custom-table">
          <thead>
            <tr>
              <th className="titleTh text-center" scope="col">username</th>
              <th className="titleTh text-center" scope="col">ชื่อ-นามสกุล</th>
              <th className="titleTh text-center" scope="col">สถานะ</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item,index)=>(
            <tr key={index}>
              <td className="titleTd text-center">{item.user_id}</td>
              <td className="titleTd text-center">{item.user_name}</td>
              <td className="titleTd text-center">{item.role}</td>
              <td className="titleTd text-center">
                <button className="btn-edit me-3" onClick={() => showEditModal(item)}>
                  <FaRegEdit /> เเก้ไข
                </button>
                {item.role ==="admin" ? null :
                <button className="btn-trash me-3" onClick={() => handleRemove(item.user_id)} >
                <FaTrash /> ลบ
                </button>
                }
                
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
            <h3 className="titleModal">เพิ่มข้อมูลผู้ใช้</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container ">
            <form className="m-5">
              <div className="form-group mt-3">
                <h3>username</h3>
                <input
                  className="form-control"
                  type="text"
                  name="user_id"
                  onChange={(e) => setUser_id(e.target.value)}
                />
              </div>
              {errors.user_id&& (
                <span className="text-danger m-t-3">{errors.user_id}</span>
              )}

              <div className="form-group mt-3">
                <h3>ชื่อ-นามสกุล</h3>
                <input
                  className="form-control"
                  type="text"
                  name="user_name"
                  onChange={(e) => setUser_name(e.target.value)}
                />
              </div>
              {errors.user_name&& (
                <span className="text-danger m-t-3">{errors.user_name}</span>
              )}

              <div className="form-group mt-3">
                <h3>รหัสผ่าน</h3>
                <input
                  className="form-control"
                  type="text"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {errors.password&& (
                <span className="text-danger m-t-3">{errors.password}</span>
              )}
              <div className="form-group mt-3">
                <h3>สถานะ</h3>
                <select
                  className="form-control mt-3"
                  name="role"
                  onChange={(e) => setRole(e.target.value)} 
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
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

    
      {/* MODAL เเก้ไขข้อมูล */}
  <Modal show={editModal} onHide={() => setEditModal(false)} className="custom-modal">
  <Modal.Header closeButton>
    <Modal.Title className="text-center w-100">
      <h3 className="titleModal">แก้ไขข้อมูลผู้ใช้ {values.user_id}</h3>
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="container">
      <form className="m-5" onSubmit={handleEditSubmit}>
     
        <div className="form-group mt-3">
          <h3>ชื่อ-นามสกุล</h3>
          <input
            className="form-control"
            type="text"
            name="user_name"
            value={values.user_name}
            onChange={handleEdit}
          />
        </div>
        <div className="form-group mt-3">
          <h3>รหัสผ่าน</h3>
          <input
            className="form-control"
            type="text"
            name="password"
            value={values.password}
            onChange={handleEdit}
          />
        </div>
        <div className="form-group">
          <h3>สถานะ</h3>
          <select
            className="form-control mt-3"
            name="role"
            value={values.role}
            onChange={handleEdit} 
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
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

export default ManagementUser;
