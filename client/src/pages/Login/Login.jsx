import { useState } from "react";
import './Login.css'
// functions
import { login } from "../../api/authApi";
// ⁡⁣⁡⁣⁣⁢redux⁡⁡
import { useDispatch} from "react-redux";
import { LOGIN } from '../../redux/authSlice';

//React router
import { useNavigate } from "react-router-dom";
import { FaLock,FaUser  } from "react-icons/fa";
//Ant เเจ้ง Alert
import { message } from 'antd';



const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [value, setValue] = useState({
    username: "",
    password: "",
  });

  //check Role User for navigat 
  const roleBaseRedirect = (role) => {
    //console.log(role);
    if (role === "admin") {
      navigate("/admin/index");
    } else {
      navigate("/user/index");
    }
  };

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    login(value)
      .then((res) => {
        //console.log(res.data);
        message.success("ยินดีต้อนรับ อาจารย์ "+res.data.payload.user.userName,1.5);
         dispatch(LOGIN(
          { token: res.data.token,
            userId: res.data.payload.user.userId,
            userName: res.data.payload.user.userName, 
            role: res.data.payload.user.role, }));

        localStorage.setItem("token", res.data.token);
        //check Roule User
        roleBaseRedirect(res.data.payload.user.role);
      })
      .catch((err) => {
        //console.log(err.response.data);
        message.error(err.response.data);
      });
  };


  return (
    <div className="container-main2">
      <h3 className="big-title-custom">เข้าสู่ระบบ</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group d-flex">
          <FaUser className="icon"/>
          <input
            placeholder="ชื่อผู้ใช้"
            className="form-control"
            type="text"
            name="username"
            onChange={handleChange}
          />
        </div>
        <div className="form-group d-flex mt-4">
          <FaLock className="icon"/>
          <input
            placeholder="รหัสผ่าน"
            className="form-control"
            type="password"
            name="password"
            onChange={handleChange}
          />
        </div>
        <div className="btn-container d-flex justify-content-center">
        <button className="btn-custom ">ลงชื่อเข้าใช้</button>
        </div> 
      </form>
    </div>
  );
};

export default Login;
