import React, { useState } from "react";
import "./Navbar.css";
import { Link, NavLink, useNavigate ,useLocation} from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { FaChevronDown,FaLock  } from "react-icons/fa";
import { BiLogIn } from "react-icons/bi";
import { GrMenu } from "react-icons/gr";
import { LOGOUT} from '../../redux/authSlice';

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => state.auth.user)

  
  const[isExpanded,setIsExpanded] =useState(false);  //hamberger menu
 
  
  

  const logout = () => {
    dispatch(LOGOUT());
    setTimeout(() => {
        navigate("/");
    }, 0);


};

  return (
    <div className="navbar w-100 shadow">
 
    <div className="navbar-left ">
          {user ? (
            <Link  to={user.role === "admin" ? "/admin/index" : "/user/index"} className="selected">
              <AiFillHome className="icons"/>หน้าหลัก
            </Link>
          ) : (
            <Link  to="/" className={location.pathname === "/" ? "active" : ""}>
              <AiFillHome className="icons"/>หน้าหลัก
            </Link>
          )}
    </div>
    
      <div className="navbar-right">
      {user && <GrMenu className="menu-responsive me-3" onClick={() => setIsExpanded(!isExpanded)} />} 
          {user && user.role === "admin" ? (
            
          <ul className={`collapsed ${isExpanded ? "is-expanded" : ""} `}>

             <NavLink to="/importcourse" className="selected"><li>Import คอร์สเรียน</li></NavLink>
             <NavLink to="/importstudent" className="selected"><li>Import นักเรียน</li></NavLink>
             <NavLink to="/booking-approval" className="selected"><li>ตรวจสอบคำร้องขอจองห้องเรียน</li></NavLink>
            

              <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  เเก้ไขข้อมูลระบบ
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link to="/data-managementroomtype" className="dropdown-item" >ข้อมูลชนิดห้อง</Link></li>
                    <li><Link to="/data-managementroom" className="dropdown-item" > ข้อมูลห้องเรียน</Link></li>
                    <li><Link to="/data-managementyearsterm" className="dropdown-item" > ข้อมูลปีเทอม</Link></li>
                    <li><Link to="/data-managementstudent" className="dropdown-item" > ข้อมูลนักศึกษา</Link></li>
                    <li><Link to="/data-managementcourse" className="dropdown-item" > ข้อมูลการลงทะเบียน</Link></li>
                    <li><Link to="/data-managementstdincourse" className="dropdown-item" > ข้อมูลนักเรียนในคอร์ส</Link></li>
                    <li><Link to="/data-managementlecturer" className="dropdown-item" >ข้อมูลอาจารย์</Link></li>
                    <li><Link to="/data-managementsubject" className="dropdown-item" > ข้อมูลวิชา</Link></li>
                    <li><Link to="/data-managementuser" className="dropdown-item" > จัดการข้อมูลผู้ใช้</Link></li>
                  </ul>
              </li>

              <li className="nav-item dropdown ">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                     Admin
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link to="/edit-profile" className="dropdown-item" >เเก้ไขข้อมูลส่วนตัว</Link></li>
                    <li><Link  onClick={logout} className="dropdown-item" > <BiLogIn/> ออกจากระบบ</Link></li>
                  </ul>
              </li>
           </ul>
          ) : user && user.role === "user" ? (
              
            <ul className={`collapsed ${isExpanded ? "is-expanded" : ""} `}>
               
                <NavLink to="/calendar" className="selected"> <li>ปฎิทินการใช้ห้อง</li></NavLink>
                <NavLink to="/booking"  className="selected"> <li>จองห้องเรียน</li></NavLink>
                <NavLink to="/booking-history" className="selected"> <li>ประวัติการจองห้องเรียน</li></NavLink>

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  อาจารย์ {user.userName}
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link to="/edit-profile" className="dropdown-item" >เเก้ไขข้อมูลส่วนตัว</Link></li>
                    <li><Link  onClick={logout} className="dropdown-item" > <BiLogIn/> ออกจากระบบ</Link></li>
                  </ul>
                </li>
            </ul>
          ) : (
              <div className="Navlogin ">
                <NavLink to="/" className="selected">
                   <FaLock/> ลงชื่อเข้าใช้
                </NavLink>
              </div>
          )}
    </div>
  </div> 
  );
};

export default Navbar;
