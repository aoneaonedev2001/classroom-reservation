import React from "react";
import { Routes, Route } from "react-router-dom";
//page
import Navbar from "./components/Navbar/Navbar";
import { useDispatch } from "react-redux";
import { LOGIN } from "./redux/authSlice";
import { currentUser } from "./api/authApi";


//Page
import Login from "./pages/Login/Login";
import MyCalendar from "./pages/MyCalendar/MyCalendar";
import Booking from "./pages/Booking/Booking";
import SinglePageBooking from "./pages/SinglePageBooking/SinglePageBooking";
import BookingHistory from "./pages/BookingHistory/BookingHistory";
import EditProfile from "./pages/EditProfile/EditProfile";
import HomeAdmin from "./pages/HomeAdmin/HomeAdmin";
import ImportCourse from "./pages/ImportCourse/ImportCourse";
import ImportStudent from "./pages/ImportStudent/ImportStudent";
import BookingApproval from "./pages/BookingApproval/BookingApproval";
import ManagementRoomType from './components/Management/ManagementRoomType'
import ManagementRoom from './components/Management/ManagementRoom'
import ManagementSubject from './components/Management/ManagementSubject'
import ManagementLecturer from './components/Management/ManagementLecturer'
import ManagementStudent from './components/Management/ManagementStudent'
import ManagementCourse from './components/Management/ManagementCourse'
import ManagementStdInCourse from './components/Management/ManagementStdInCourse'
import ManagementYearsTerm from './components/Management/ManagementYearsTerm'
import ManagementUser from './components/Management/ManagementUser'

//Protect Routes
import UserRoute from "./Protect_Rout/UserRoute"; 
import AdminRoute from "./Protect_Rout/AdminRoute";

const App = () => {
  const dispatch = useDispatch();
  const idtoken = localStorage.token;
  if (idtoken) {
    currentUser(idtoken)
      .then((res) => {
        dispatch(
          LOGIN({
            token: idtoken,
            userId: res.data.user_id,
            userName: res.data.user_name,
            role: res.data.role,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/"                           element={<Login />} />
        <Route path="/calendar"                   element={<MyCalendar />} />
        <Route path="/edit-profile"               element={<EditProfile />} />
        <Route path="/user/index"                 element={<UserRoute>  <Booking />             </UserRoute>}/>
        <Route path="/booking"                    element={<UserRoute>  <Booking />               </UserRoute>}/>
        <Route path="/booking/:id"                element={<UserRoute>  <SinglePageBooking />     </UserRoute>}/>
        <Route path="/booking-history"            element={<UserRoute>  <BookingHistory />        </UserRoute>}/>

        {/* admin */}
        <Route path="/admin/index"                element={<AdminRoute>  <HomeAdmin/>             </AdminRoute>}/>
        <Route path="/importcourse"               element={<AdminRoute>  <ImportCourse/>          </AdminRoute>}/>
        <Route path="/importstudent"              element={<AdminRoute>  <ImportStudent/>         </AdminRoute>}/>
        <Route path="/booking-approval"           element={<AdminRoute>  <BookingApproval/>       </AdminRoute>}/>
        <Route path="/data-managementroom"        element={<AdminRoute>  <ManagementRoom/>        </AdminRoute>}/>
        <Route path="/data-managementroomtype"    element={<AdminRoute>  <ManagementRoomType/>    </AdminRoute>}/>
        <Route path="/data-managementcourse"      element={<AdminRoute>  <ManagementCourse/>      </AdminRoute>}/>
        <Route path="/data-managementlecturer"    element={<AdminRoute>  <ManagementLecturer/>    </AdminRoute>}/>
        <Route path="/data-managementstdincourse" element={<AdminRoute>  <ManagementStdInCourse/> </AdminRoute>}/>
        <Route path="/data-managementstudent"     element={<AdminRoute>  <ManagementStudent/>     </AdminRoute>}/>
        <Route path="/data-managementsubject"     element={<AdminRoute>  <ManagementSubject/>     </AdminRoute>}/>
        <Route path="/data-managementyearsterm"   element={<AdminRoute>  <ManagementYearsTerm/>   </AdminRoute>}/>
        <Route path="/data-managementuser"        element={<AdminRoute>  <ManagementUser/>        </AdminRoute>}/>
      </Routes>
    </div>
  );
};

export default App;
