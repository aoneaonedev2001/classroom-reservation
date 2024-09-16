import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  readAllreservation,
  reservationByYearTerm,
} from "../../api/reservationApi";
import { readAllYearsTerm } from "../../api/years_termApi";
import { Modal, Button } from "react-bootstrap";
import "./BookingApproval.css";
import moment from "moment";
import "moment/locale/th";
import { useReactToPrint } from "react-to-print";
import ReactToPrint from 'react-to-print';
import ReservationformPDF from "../../components/ReservationformPDF/ReservationformPDF";



const BookingApproval = () => {
  const user = useSelector((state) => state.auth.user);
  const [faculty, setFaculty] = useState("เทคโนโลยีอุตสาหกรรม");
  const [major_name, setMajor_name] = useState("วิศวะกรรมคอมพิวเตอร์");
  //modale
  const [showModal, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  //1------------------------------------------readAllReservation and loadData---------------------------------
  const [data, setData] = useState([]);
  const loadData = (authtoken) => {
    readAllreservation(authtoken)
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

  //3 ถ้าเลือกปีเทอมจะ fetch ปีเทอมนั้นๆมาเเสดงเเทน readAllReservation
  const loadReservationByYearTerm = (selectedValue) => {
    const [Year, Term] = selectedValue.split(",");
    if (user && user.token && Year && Term) {
      reservationByYearTerm(user.token, Year, Term)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    } else {
      // ถ้าไม่มีข้อมูลใน Year หรือ Term ให้โหลดข้อมูลใหม่ด้วย loadData
      loadData(user.token);
    }
  };
  //2-------------------------------------------------- fetch Year And Term มาเป็น value ใน input ---------------------------------

  const [SelectYearTerm, setSelectYearTerm] = useState([]);
  useEffect(() => {
    readAllYearsTerm(user.token)
      .then((res) => {
        setSelectYearTerm(res.data);
      })
      .catch((err) => {
        //console.log(err.response.data);
      });
  }, []);

  //--------------------------------------------------------เอาข้อมูลของคอร์สไปset ใน modal เพื่อตรวจสอบ ---------------------------------
  // เอา item ไปsetใน modal
  const [selectedItem, setSelectedItem] = useState(null);
  const handleSubmit = (item) => {
    setSelectedItem(item);
    handleModalShow();
  };

 //--------PDF dowlond
 const componentRef = useRef();
 const handlePrint = useReactToPrint({
  content: () => componentRef.current
});

const formatDateWithBuddhistEra = (date) => {
  return moment(date)
    .locale("th")
    .add(543, "years") // เพิ่ม 543 ปีเพื่อให้เป็นปีพุทธศักราช
    .format("LL");
};


  return (
    <>
      <div className="container-main-noborder">
        <div className="d-flex justify-content-start align-items-center">
          <h3 className="title">รายการจองห้อง</h3>
        </div>
        <div className="mt-3 mb-1">
          <label htmlFor="YearTerm" className="title2 me-2">
            ค้นหา :
          </label>
          <select
            className="ms-2"
            name="YearTerm"
            onChange={(e) => {
              const selectedValue = e.target.value;
              loadReservationByYearTerm(selectedValue);
            }}
          >
            <option value="">ปีเทอมทั้งหมด</option>
            {SelectYearTerm.map((item, index) => (
              <option key={index} value={`${item.Years},${item.Term}`}>
                ปีการศึกษา{item.Years} เทอม {item.Term}
              </option>
            ))}
          </select>
        </div>

        <div className="py-2">
          <table className="table table-bordered shadow custom-table">
            <thead>
              <tr>
                <th className="text-center" scope="col">
                  <h3 className="titleTh">ห้อง</h3>
                </th>
                <th className="text-center" scope="col">
                  <h3 className="titleTh">วิชา</h3>
                </th>
                <th className="text-center" scope="col">
                  <h3 className="titleTh">ชื่อผู้จอง</h3>
                </th>
                <th className="text-center" scope="col">
                  <h3 className="titleTh">วันที่จอง</h3>
                </th>
                {/* จะซ้อนที่ขนาดหน้าจอ มือถือ */}
                <th className="hid-600px text-center" scope="col">
                  <h3 className="titleTh">ช่วงเวลา</h3>
                </th>

                {data.length > 0 && (
                  <th className="text-center" scope="col"></th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="text-center">
                    <h3 className="titleTd">{item.room_id}</h3>
                  </td>
                  <td className="text-center">
                    <h3 className="titleTd">
                      {item.subj_code} {item.subj_name}
                    </h3>
                  </td>
                  <td className="text-center">
                    <h3 className="titleTd">{item.user_name}</h3>
                  </td>
                  {/* จะซ้อนที่ขนาดหน้าจอ มือถือ */}
                  <td className="hid-600px text-center">
                    <h3 className="titleTd">
                      {formatDateWithBuddhistEra(item.reservation_date)}
                    </h3>
                  </td>
                  <td className="hid-600px text-center">
                    <h3 className="titleTd">
                      {item.reservation_time === "AM"
                        ? "08:00 - 12:00"
                        : "12:00 - 18:00"}
                    </h3>
                  </td>
                  {/* จะเเสดงที่ขนาดหน้าจอ มือถือ */}
                  <td className="show-hid-600px text-center">
                    <h3 className="titleTd">
                      {moment(item.reservation_date).locale("th").format("LL")}
                    </h3>
                    <h3 className="titleTd">
                      {item.reservation_time === "AM"
                        ? "08:00 - 12:00"
                        : "12:00 - 18:00"}
                    </h3>
                  </td>

                  <td className="text-center">
                    <button
                      className="btn-manage2 "
                      onClick={() => handleSubmit(item)}
                    >
                      ตรวจสอบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <Modal
          show={showModal}
          onHide={handleModalClose}
          className="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-center w-100">
              <h3 className="titleModal">รายละเอียดของการจอง</h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container text-center">
              <div className="row">
                <div className="col text-start">
                  <h3 className="title">ห้อง</h3>
                  <h3 className="dec mb-5">
                    {selectedItem ? selectedItem.room_id : ""}
                  </h3>
                  <h3 className="title">สาขาวิชา</h3>
                  <h3 className="dec mb-5">{major_name}</h3>
                  <h3 className="title">คณะ</h3>
                  <h3 className="dec mb-5">{faculty}</h3>
                  <h3 className="title">มีความประสงค์ใช้ห้องเพื่อ</h3>
                  <h3 className="dec mb-5">ทำการเรียนการสอน</h3>
                  <h3 className="title">จองห้องวันที่</h3>
                  <h3 className="dec mb-5">
                    {moment(selectedItem ? selectedItem.reservation_date : "")
                      .locale("th")
                      .format("LL")}
                  </h3>
                </div>
                <div className="col text-start">
                  <h3 className="title">ผู้จอง</h3>
                  <h3 className="dec mb-5">อาจาร</h3>
                  <h3 className="title">ชื่อผู้จอง</h3>
                  <h3 className="dec mb-5">
                    {selectedItem ? selectedItem.user_name : ""}
                  </h3>
                  <h3 className="title">เบอร์โทรศัพที่ติดต่อได้</h3>
                  <h3 className="dec mb-5">....</h3>
                  <h3 className="title">จำนวนผู้ใช้ห้อง</h3>
                  <h3 className="dec mb-5">
                    {selectedItem ? selectedItem.capacity : ""}
                  </h3>
                  <h3 className="title">ช่วงเวลา</h3>
                  <h3 className="dec mb-5">
                    {selectedItem
                      ? selectedItem.reservation_time === "AM"
                        ? "08:00 - 12:00"
                        : "12:00 - 18:00"
                      : ""}
                  </h3>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center w-100">
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
            {/*Print PDF */}
            <ReactToPrint
            trigger={() => <Button className="btn btn-primary m-1">พิมพ์ใบจองห้อง</Button>}
            content={() => componentRef.current}
          />
          </Modal.Footer>
        </Modal>

        <div className="row">
          <div className="col"></div>
        </div>
      </div>

      <div style={{ display: 'none' }}>
        <ReservationformPDF
          ref={componentRef}
          selectedItem={selectedItem}
          faculty={faculty}
          major_name={major_name}
        />
      </div>

    </>
  );
};



export default BookingApproval;
