import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentYearTerm } from "../../redux/authSlice";

//function
import { readCoursesByYereTerm } from "../../api/courseApi";

const HomeAdmin = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const findYearTerm = useSelector((state) => state.auth.findYearTerm);

  useEffect(() => {
    dispatch(fetchCurrentYearTerm());
  }, [dispatch]);

  //------------------------------------------readAllCourse and loadData---------------------------------
  const [data, setData] = useState([]);
  const loadData = async (authtoken) => {
    const value = {
      years: findYearTerm.Years,
      term: findYearTerm.Term,
    };

    readCoursesByYereTerm(authtoken, value)
      .then((res) => {
        setData(res.data);
        //console.log(data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  useEffect(() => {
    loadData(user.token);
  }, [findYearTerm]);

  return (
    <div className="container-main-noborder">
      <h3 className="big-title py-3">ข้อมูลวิชาปีเทอมปัจจุบัน</h3>
      <h3 className="title-custom mt-5 mb-3">
        ข้อมูลวิชาปีการศึกษา :{" "}
        <span className="editspan">
          {" "}
          {findYearTerm ? findYearTerm.Years : ""}{" "}
        </span>
        ภาคการศึกษาที่ :{" "}
        <span className="editspan">
          {findYearTerm ? findYearTerm.Term : ""}
        </span>
      </h3>

      <div className="py-2 " style={{ maxHeight: "500px", overflowY: "auto" }}>
        <table className="table table-bordered shadow custom-table ">
          <thead>
            <tr>
              <th className="titleTh text-center" scope="col">
                รหัสวิชา
              </th>
              <th className="titleTh text-center" scope="col">
                ชื่อวิชา
              </th>
              <th className="titleTh text-center" scope="col">
                อาจารย์ประจำคอร์ส
              </th>
              <th className="titleTh text-center" scope="col">
                ห้อง
              </th>
              <th className="titleTh text-center" scope="col">
                ปีการศึกษา
              </th>
              <th className="titleTh text-center" scope="col">
                เทอม
              </th>
              <th className="titleTh text-center" scope="col">
                วัน
              </th>
              <th className="titleTh text-center" scope="col">
                เวลา
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="titleTd text-center">{item.subj_code}</td>
                <td className="titleTd text-center">{item.subj_name}</td>
                <td className="titleTd text-center">{item.lect_name}</td>
                <td className="titleTd text-center">{item.room_id}</td>
                <td className="titleTd text-center">{item.Years}</td>
                <td className="titleTd text-center">{item.Term}</td>
                <td className="titleTd text-center">{item.day}</td>
                <td className="titleTd text-center">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomeAdmin;
