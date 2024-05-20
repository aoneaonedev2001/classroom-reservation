import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaPlus, FaTrash, FaRegEdit } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
//function
import {
  createRoomType,
  readAllRoomsType,
  updateRoomType,
  deleteRoomType,
} from "../../api/roomApi";

import { message } from "antd";

const ManagementRoomType = () => {
  const user = useSelector((state) => state.auth.user);
  const [roomtype_name, setRoomtype_name] = useState("");

  //------------------------------------------cerate roomType--------------------------------------------
  //createModal
  const [showModal, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      roomtype_name,
    };
    createRoomType(user.token, newPost)
      .then((res) => {
        loadData(user.token);
        handleModalClose();
        message.success("create Room Type Success");
      })
      .catch((err) => message.error(err.response.data.error));
  };

  //------------------------------------------readAllRoomType and loadData---------------------------------
  const [data, setData] = useState([]);
  const loadData = (authtoken) => {
    readAllRoomsType(authtoken)
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

  //------------------------------------------updateRoomTypeType-------------------------------------------
  //editModal
  const [editModal, setEditModal] = useState(false);
  const [values, setValues] = useState({
    roomtype_id: "",
    roomtype_name: "",
  });
  const showEditModal = (room) => {
    setValues({
      roomtype_id: room.roomtype_id,
      roomtype_name: room.roomtype_name,
    });
    setEditModal(true);
  };
  const handleEdit = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateRoomType(user.token, values.roomtype_id, values)
      .then((res) => {
        //alert("Update Room Success");
        message.success("Update Room Success");
        loadData(user.token);
        setEditModal(false);
      })
      .catch((err) => message.error(err.response.data.error));
  };
  //------------------------------------------deleteRoomTypeType---------------------------------------------
  const handleRemove = (id) => {
    if (window.confirm("Are You Sure Delete!!")) {
      deleteRoomType(user.token, id)
        .then((res) => {
          loadData(user.token);
          message.success("Delete Room type Success");
        })
        .catch((err) => {
          message.error("ไม่สามารถลบได้ เนื่องจากชนิดห้องนี้ถูกใช้งานอยู่");
        });
    }
  };

  return (
    <div className="container-main-noborder">
      <h3 className="big-title py-3">จัดการข้อมูล</h3>
      <div className="d-flex justify-content-start align-items-center">
        <h3 className="title">ข้อมูลชนิดห้อง</h3>
        <button className="btn-manage ms-2" onClick={() => handleModalShow()}>
          <FaPlus /> เพิ่มข้อมูล
        </button>
      </div>

      <div className="py-2" style={{ maxHeight: "500px", overflowY: "auto" }}>
        <table className="table table-bordered shadow custom-table">
          <thead>
            <tr>
              <th className="text-center" scope="col">
                <h3 className="titleTh">ชื่อชนิดห้อง</h3>
              </th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="titleTd text-center">{item.roomtype_name}</td>
                <td className="titleTd text-center ">
                  <button
                    className="btn-edit me-3"
                    onClick={() => showEditModal(item)}
                  >
                    <FaRegEdit /> เเก้ไข
                  </button>
                  <button
                    className="btn-trash me-3"
                    onClick={() => handleRemove(item.roomtype_id)}
                  >
                    <FaTrash /> ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL เพิ่มข้อมูล */}
      <Modal
        show={showModal}
        onHide={handleModalClose}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            <h3 className="titleModal">เพิ่มข้อมูลชนิดห้อง</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container ">
            <form className="m-5">
              <div className="form-group mt-3">
                <h3>ชื่อชนิดห้อง</h3>
                <input
                  className="form-control"
                  type="text"
                  name="roomtype_name"
                  onChange={(e) => setRoomtype_name(e.target.value)}
                />
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center w-100">
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL เเก้ไขข้อมูล */}
      <Modal
        show={editModal}
        onHide={() => setEditModal(false)}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            <h3 className="titleModal">
              แก้ไขข้อมูลชนิดห้อง {values.roomtype_id}
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <form className="m-5" onSubmit={handleEditSubmit}>
              <div className="form-group mt-3">
                <h3>ชื่อชนิดห้อง</h3>
                <input
                  className="form-control"
                  type="text"
                  name="roomtype_name"
                  value={values.roomtype_name}
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

export default ManagementRoomType;
