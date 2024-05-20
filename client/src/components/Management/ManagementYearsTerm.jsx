import { useState,useEffect } from "react";
import { useSelector } from "react-redux";
import { FaPlus, FaTrash, FaRegEdit } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import moment from 'moment';
import 'moment/locale/th'; 
//function
import {createYearsTerm,readAllYearsTerm,updateYearsTerm,deleteYearsTerm}from "../../api/years_termApi"
//Ant เเจ้ง Alert
import { message } from 'antd';

const ManagementYearsTerm = () => {
  const user = useSelector(state => state.auth.user)
  const [Years, setYears] = useState("");
  const [Term, setTerm] = useState("");
  const [date_begin, setDate_begin] = useState("");
  const [date_end, setDate_end] = useState("");
  
  
//------------------------------------------cerate YearsTerm--------------------------------------------
//createModal
const [showModal, setShowModal] = useState(false);
const handleModalClose = () => setShowModal(false);
const handleModalShow = () => setShowModal(true);


const handleSubmit = async (e) => {
  e.preventDefault();
  const newPost = {
    Years,
    Term,
    date_begin: moment(date_begin).format('YYYY-MM-DD'),
    date_end: moment(date_end).format('YYYY-MM-DD'),
  };

  // ตรวจสอบว่าข้อมูลในฟอร์มถูกกรอกครบหรือไม่
  if (!newPost.Years || !newPost.Term || !newPost.date_begin || !newPost.date_end) {
    // หากไม่ครบก็แสดงข้อความแจ้งเตือน
    message.error('กรุณากรอกข้อมูลให้ครบทุกช่อง');
    console.log('กรุณากรอกข้อมูลให้ครบทุกช่อง');
    return;
  }
  // ตรวจสอบว่าเทอมการศึกษาถูกเลือกหรือไม่
  if (newPost.Term !== "1" && newPost.Term !== "2") {
    message.error('กรุณาเลือกเทอมการศึกษา');
    return;
  }


  // ตรวจสอบว่าวันเริ่มต้นและวันสิ้นสุดมีความสัมพันธ์ถูกต้องหรือไม่
  if (moment(date_begin).isAfter(moment(date_end))) {
    message.error('วันเริ่มต้นต้องเป็นวันก่อนวันสิ้นสุด');
    return;
  }
  
  createYearsTerm(user.token, newPost)
    .then((res) => {
      console.log(res.data);
      loadData(user.token);
      handleModalClose();
      message.success('create Years and Term Success'); 
    })
    .catch((err) => {
      console.log(err.response.data.error);
      message.error(err.response.data.error);
    });
};




//------------------------------------------readAllYearsTerm and loadData---------------------------------
 const [data, setData] = useState([]);         
 const loadData = (authtoken) => { 
  readAllYearsTerm(authtoken)
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
//------------------------------------------updateYearsTerm-------------------------------------------
  //editModal 
  const [editModal, setEditModal] = useState(false);
  const [values, setValues] = useState({
    Years: "",
    Term: "",
    date_begin: "",
    date_end: "",
  });
  const showEditModal = (YearsTerm) => {
    setValues({
      Years: YearsTerm.Years,
      Term: YearsTerm.Term,
      date_begin: YearsTerm.date_begin,
      date_end: YearsTerm.date_end,
    });
    setEditModal(true);
  };
  const handleEdit = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
      

    updateYearsTerm(user.token, values)
      .then((res) => {
        //alert("Update YearsTerm Success");
        message.success('Update Years and Term Success');
        loadData(user.token);
        setEditModal(false);
      })
      .catch((err) => console.log(err.response.data));
  };
//------------------------------------------deleteYearsTerm---------------------------------------------
  const handleRemove = ( yid, tid) => {
    if (window.confirm("Are You Sure Delete!!")) { 
      deleteYearsTerm(user.token, yid,tid)                   
        .then((res) => {                           
          console.log(res);
          loadData(user.token);
          message.success('Delete Years and Term Success');               
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
        <h3 className="title">ข้อมูลวันเริ่มต้นและวันสิ้นสุดภาคการศึกษา</h3>
        <button className="btn-manage ms-2" onClick={() => handleModalShow()}>
          <FaPlus /> เพิ่มข้อมูล
        </button>
      </div>

      <div className="py-2" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="table table-bordered shadow custom-table">
          <thead>
            <tr>
              <th className="text-center" scope="col">
                <h3 className="titleTh">ปีการศึกษา</h3>
              </th>
              <th className="text-center" scope="col">
                <h3 className="titleTh">เทอมการศึกษา</h3>
              </th>
              <th className="text-center" scope="col">
                <h3 className="titleTh">วันเริ่มต้น</h3>
              </th>
              <th className="text-center" scope="col">
                <h3 className="titleTh">วันสิ้นสุด</h3>
              </th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item,index)=>(
            <tr key={index}>
              <td className="titleTd text-center">{item.Years}</td>
              <td className="titleTd text-center">{item.Term}</td>
              <td className="titleTd text-center">{moment(item.date_begin).locale('th').format('LL')}</td>
              <td className="titleTd text-center">{moment(item.date_end).locale('th').format('LL')}</td>
              <td className="text-center">
                <button className="btn-edit me-3" onClick={() => showEditModal(item)}>
                  <FaRegEdit /> เเก้ไข
                </button>
                <button className="btn-trash me-3" onClick={() => handleRemove(item.Years,item.Term)} >
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
            <h3 className="titleModal">เพิ่มข้อมูลวันเริ่มต้นและวันสิ้นสุดภาคการศึกษา</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container ">
            <form className="m-5">
              <div className="form-group mt-3">
                <h3>ปีการศึกษา</h3>
                <input
                  className="form-control"
                  type="text"
                  placeholder="เช่น 2566,2567"
                  name="Years"
                  onChange={(e) => setYears(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <h3>เทอมการศึกษา</h3> 
                <select
                  className="form-control mt-3"
                  name="Term"
                  onChange={(e) => setTerm(e.target.value)} 
                >
                  <option >ภาคเรียน..</option>
                  <option value="1">ภาคเรียนที่ 1</option>
                  <option value="2">ภาคเรียนที่ 2</option>
                </select>
              </div>

              <div className="form-group mt-3">
                <h3>วันเริ่มต้น</h3>
                <input
                  className="form-control"
                  type="date" 
                  name="date_begin"
                  onChange={(e) => setDate_begin(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <h3>วันสิ้นสุด</h3>
                <input
                  className="form-control"
                  placeholder="เดือน/วันที่/ปี"
                  type="date" 
                  name="date_end"
                  onChange={(e) => setDate_end(e.target.value)}
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
      <h3 className="titleModal">แก้ไขข้อมูลปีการศึกษาที่ :{values.Years}เทอม :{values.Term}</h3>
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="container">
      <form className="m-5" onSubmit={handleEditSubmit}>
        <div className="form-group">
            <h3>วันเริ่มต้น</h3>
            <input
              className="form-control"
              type="date" 
              name="date_begin"
              value={values.date_begin}
              onChange={handleEdit}
            />
          </div>
          <div className="form-group mt-3">
            <h3>วันสิ้นสุด</h3>
            <input
              className="form-control"
              type="date" 
              name="date_end"
              value={values.date_end}
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

export default ManagementYearsTerm;
