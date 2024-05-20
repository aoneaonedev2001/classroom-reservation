import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentYearTerm } from "../../redux/authSlice";

import { useNavigate, useLocation } from "react-router-dom";
// Function
import { readCoursesByLecturer } from "../../api/courseApi";
import "./Booking.css";

const Booking = () => {
  const navigate = useNavigate();
  const Location = useLocation();
  //console.log(Location.pathname);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const findYearTerm = useSelector((state) => state.auth.findYearTerm);

  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(fetchCurrentYearTerm());
  }, [dispatch]);

  useEffect(() => {
    if (user && findYearTerm) {
      const value = {
        lect_id: user.userId,
        years: findYearTerm.Years,
        term: findYearTerm.Term,
      };

      readCoursesByLecturer(user.token, value)
        .then((res) => {
          setData(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user, findYearTerm]);

  const handleSubmit = (id) => {
    navigate(`/booking/${id}`);
  };

  return (
    <>
      {Location.pathname === "/user/index" ? null : (
        <h1 className="big-title text-center">จองห้องเรียน</h1>
      )}
      <div className="container-main">
        <div className="d-flex justify-content-start align-items-center">
          <h3 className="title-custom mt-5 mb-3">
            วิชาที่มีสอนปีการศึกษา :{" "}
            <span className="editspan">
              {" "}
              {findYearTerm ? findYearTerm.Years : ""}{" "}
            </span>
            ภาคการศึกษาที่ :{" "}
            <span className="editspan">
              {findYearTerm ? findYearTerm.Term : ""}
            </span>
          </h3>
        </div>

        <div className="py-2">
          <table className="table table-bordered shadow custom-table">
            <thead>
              <tr>
                <th className="titleTh text-center" scope="col">
                  รหัสวิชา
                </th>
                <th className="titleTh text-center" scope="col">
                  ชื่อวิชา
                </th>
                <th className="titleTh text-center" scope="col">
                  ห้องเรียน
                </th>
                <th className="titleTh text-center" scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="titleTd text-center">{item.subj_code}</td>
                  <td className="titleTd text-center">{item.subj_name}</td>
                  <td className="titleTd text-center">{item.room_id}</td>
                  <td className="titleTd text-center">
                    <button
                      className="btn-manage2  "
                      onClick={() => handleSubmit(item.course_id)}
                    >
                      จองห้องเรียนเพิ่มเติม
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

export default Booking;
