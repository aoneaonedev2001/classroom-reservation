import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaPlus, FaTrash, FaRegEdit } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
//function
import {
  createRoom,
  readAllRooms,
  readAllRoomsType,
  updateRoom,
  deleteRoom,
} from "../../api/roomApi";
//Ant เเจ้ง Alert
import { message } from "antd";

const ManagementRoom = () => {
  const user = useSelector((state) => state.auth.user);
  const [room_id, setRoom_id] = useState("");
  const [roomtype_id, setRoomtype_id] = useState("");
  const [capacity, setCapacity] = useState("");
  const [building, setBuilding] = useState("");

  //fetch roomtype มาเป็น value ใน input
  const [SelectRoomType, setSelectRoomType] = useState([]);
  useEffect(() => {
    readAllRoomsType()
      .then((res) => {
        setSelectRoomType(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);

  //------------------------------------------cerate room--------------------------------------------
  //createModal
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
    setErrors({});
  };

  const handleModalShow = () => setShowModal(true);
  const [errors, setErrors] = useState({});
  // Validation for create room modal
  const validateFormCreateRoom = () => {
    let valid = true;
    const newErrors = {};
    // Validate roomtype_id
    if (!roomtype_id) {
      newErrors.roomtype_id = "โปรดระบุชนิดห้อง";
      valid = false;
    }
    // Validate room_id
    if (!room_id) {
      newErrors.room_id = "โปรดระบุเลขห้อง";
      valid = false;
    }
    // Validate capacity
    if (!capacity) {
      newErrors.capacity = "โปรดระบุความจุห้อง";
      valid = false;
    }
    // Validate building
    if (!building) {
      newErrors.building = "โปรดระบุอาคาร";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateFormCreateRoom()) {
      const values = {
        room_id,
        roomtype_id,
        capacity,
        building,
      };
      createRoom(user.token, values)
        .then((res) => {
          loadData(user.token);
          handleModalClose();
          message.success("create Room Success");
        })
        .catch((err) => {
          message.error(err.response.data.error);
          handleModalClose();
          setBuilding("");
          setCapacity("");
          setRoom_id("");
          setRoomtype_id("");
        });
    }
  };

  //------------------------------------------readAllRoom and loadData---------------------------------
  const [data, setData] = useState([]);
  const loadData = (authtoken) => {
    readAllRooms(authtoken)
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
  const handleEditModalClose = () => {
    setEditModal(false);
    setErrors({});
  };

  const [values, setValues] = useState({
    room_id: "",
    roomtype_id: "",
    capacity: "",
    building: "",
  });

  //Validation
  const validateForm = () => {
    let valid = true;
    const newErrors = {};
    // Validate roomtype_id
    if (!values.roomtype_id) {
      newErrors.roomtype_id = "โปรดระบุชนิดห้อง";
      valid = false;
    }
    // Validate room_id
    if (!values.room_id) {
      newErrors.room_id = "โปรดระบุเลขห้อง";
      valid = false;
    }
    // Validate capacity
    if (!values.capacity) {
      newErrors.capacity = "โปรดระบุความจุห้อง";
      valid = false;
    }
    // Validate building
    if (!values.building) {
      newErrors.building = "โปรดระบุอาคาร";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const showEditModal = (room) => {
    setValues({
      room_id: room.room_id,
      roomtype_id: room.roomtype_id,
      capacity: room.capacity,
      building: room.building,
    });
    setEditModal(true);
  };
  const handleEdit = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      updateRoom(user.token, values.room_id, values)
        .then((res) => {
          message.success("Update Room Success");
          loadData(user.token);
          setEditModal(false);
        })
        .catch((err) => console.log(err.response.data));
    }
  };
  //------------------------------------------deleteRoom---------------------------------------------
  const handleRemove = (id) => {
    if (window.confirm("Are You Sure Delete!!")) {
      deleteRoom(user.token, id)
        .then((res) => {
          loadData(user.token);
          message.success("Delete Room  Success");
        })
        .catch((err) => {
          message.error("ไม่สามารถลบได้ เนื่องจากห้องนี้ถูกใช้งานอยู่");
        });
    }
  };

  return (
    <div className="container-main-noborder">
      <h3 className="big-title py-3">จัดการข้อมูล</h3>
      <div className="d-flex justify-content-start align-items-center">
        <h3 className="title">ข้อมูลห้องเรียน</h3>
        <button className="btn-manage ms-2" onClick={() => handleModalShow()}>
          <FaPlus /> เพิ่มข้อมูล
        </button>
      </div>

      <div className="py-2" style={{ maxHeight: "500px", overflowY: "auto" }}>
        <table className="table table-bordered shadow custom-table">
          <thead>
            <tr>
              <th className="titleTh text-center" scope="col">
                อาคาร
              </th>
              <th className="titleTh text-center" scope="col">
                ห้อง
              </th>
              <th className="titleTh text-center" scope="col">
                {" "}
                ความจุ
              </th>
              <th className="titleTh text-center" scope="col">
                {" "}
                ชนิดห้อง
              </th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="titleTd text-center ">{item.building}</td>
                <td className="titleTd text-center">{item.room_id}</td>
                <td className="titleTd text-center">{item.capacity} คน</td>
                <td className=" titleTd text-center">{item.roomtype_name}</td>
                <td className="text-center">
                  <button
                    className="btn-edit me-3"
                    onClick={() => showEditModal(item)}
                  >
                    <FaRegEdit /> เเก้ไข
                  </button>
                  <button
                    className="btn-trash me-3"
                    onClick={() => handleRemove(item.room_id)}
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
            <h3 className="titleModal">เพิ่มข้อมูลห้องเรียน</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container ">
            <form className="m-5">
              <div className="form-group ">
                <h3>อาคาร</h3>
                <input
                  className="form-control"
                  type="text"
                  name="building"
                  onChange={(e) => setBuilding(e.target.value)}
                />
              </div>
              {errors.building && (
                <span className="text-danger m-t-3">{errors.building}</span>
              )}

              <div className="form-group mt-3">
                <h3>ห้อง</h3>
                <input
                  className="form-control"
                  type="text"
                  name="room_id"
                  onChange={(e) => setRoom_id(e.target.value)}
                />
              </div>
              {errors.room_id && (
                <span className="text-danger m-t-3">{errors.room_id}</span>
              )}

              <div className="form-group mt-3">
                <h3>ความจุ</h3>
                <input
                  className="form-control"
                  type="text"
                  name="capacity"
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>
              {errors.capacity && (
                <span className="text-danger m-t-3">{errors.capacity}</span>
              )}

              <div className="form-group mt-3">
                <h3>ชนิดห้อง</h3>
                <select
                  className="form-control"
                  name="roomtype_id"
                  onChange={(e) => setRoomtype_id(e.target.value)}
                >
                  <option value="">เลือก...</option>
                  {SelectRoomType.map((item, index) => (
                    <option key={index} value={item.roomtype_id}>
                      {item.roomtype_name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.roomtype_id && (
                <span className="text-danger m-t-3">{errors.roomtype_id}</span>
              )}
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
        onHide={handleEditModalClose}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            <h3 className="titleModal">แก้ไขข้อมูลห้อง {values.room_id}</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <form className="m-5" onSubmit={handleEditSubmit}>
              <div className="form-group">
                <h3>อาคาร</h3>
                <input
                  className="form-control"
                  type="text"
                  name="building"
                  value={values.building}
                  onChange={handleEdit}
                />
              </div>
              {errors.building && (
                <span className="text-danger m-t-3">{errors.building}</span>
              )}
              <div className="form-group mt-3">
                <h3>ความจุ</h3>
                <input
                  className="form-control"
                  type="text"
                  name="capacity"
                  value={values.capacity}
                  onChange={handleEdit}
                />
              </div>
              {errors.capacity && (
                <span className="text-danger m-t-3">{errors.capacity}</span>
              )}
              <div className="form-group mt-3">
                <h3>ชนิดห้อง</h3>
                <select
                  className="form-control"
                  name="roomtype_id"
                  onChange={handleEdit}
                >
                  <option value="">เลือก...</option>
                  {SelectRoomType.map((item, index) => (
                    <option key={index} value={item.roomtype_id}>
                      {item.roomtype_name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.roomtype_id && (
                <span className="text-danger m-t-3">{errors.roomtype_id}</span>
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

export default ManagementRoom;
