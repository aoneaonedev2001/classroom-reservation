import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  readreservationByid,
  deleteReservation,
} from "../../api/reservationApi";
import moment from "moment";
import "moment/locale/th";
import "./BookingHistory.css";

const BookingHistory = () => {
  const user = useSelector((state) => state.auth.user);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (user && user.token) {
      const ID = user.userId;
      readreservationByid(user.token, ID)
        .then((res) => {
          setData(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user]);

  const handleDelete = (id) => {
    if (window.confirm("Are You Sure Delete!!")) {
      deleteReservation(user.token, id)
        .then((res) => {
          //alert("delete Reservation Success");
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <h1 className="big-title">ประวัติการจองห้องเรียน</h1>
      <div className="container-main">
        <div className="d-flex justify-content-start align-items-center">
          <h3 className="title mt-3 mb-2">รายการจองห้องของฉัน</h3>
        </div>
        <div className="py-2">
          <table className="table table-bordered shadow custom-table">
            <thead>
              <tr>
                <th className="titleTh text-center" scope="col">
                  ห้องเรียน
                </th>
                <th className="titleTh text-center" scope="col">
                  วิชา
                </th>
                <th className="titleTh text-center" scope="col">
                  จองวันที่
                </th>
                <th className="titleTh text-center" scope="col">
                  เวลา
                </th>
                {data.length > 0 && (
                  <th className="titleTh text-center" scope="col"></th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="titleTd text-center">{item.room_id}</td>
                  <td className="titleTd text-center">
                    {item.subj_code} {item.subj_name}
                  </td>
                  <td className="titleTd text-center">
                    {moment(item.reservation_date).locale("th").format("LL")}
                  </td>
                  <td className="titleTd text-center">
                    {item.reservation_time === "AM"
                      ? "08:00 - 12:00"
                      : "12:00 - 18:00"}
                  </td>
                  <td className="titleTd text-center">
                    <button
                      className="btn-trash "
                      onClick={() => handleDelete(item.reservation_id)}
                    >
                      ยกเลิกการจอง
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BookingHistory;
