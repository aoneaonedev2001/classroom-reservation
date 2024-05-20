import axios from "axios";


//---- findDayTime (หาวันเวลาที่ว่างตรงกัน)
export const findDayTime = async (authtoken, value) => { 
    return await axios.post(process.env.REACT_APP_API + "/reservationfindDayTime", value, {
      headers: {
        authtoken,
      },
    });
  };



  //---- reservation (จองห้อง)
export const reservation = async (authtoken, value) => { 
  return await axios.post(process.env.REACT_APP_API + "/reservation", value, {
    headers: {
      authtoken,
    },
  });
};



//todo testgood
export const reservationByYearTerm= async (authtoken,Year,Term) => {
  return await axios.get(`${process.env.REACT_APP_API}/reservation/${Year}/${Term}`,{
    headers: {
        authtoken, 
      },
  });
  };



  //---- readAllreservation (อ่านประวัติการจองห้องทั้งหมด)
  export const readAllreservation = async (authtoken) => { 
    return await axios.get(`${process.env.REACT_APP_API}/reservation`, {
      headers: {
        authtoken,
      },
    });
  };



  //---- readreservationByid (อ่านประวัติการจองจาก user_id)
  export const readreservationByid = async (authtoken, ID) => { 
    return await axios.get(`${process.env.REACT_APP_API}/reservationbyuserid/${ID}`, {
      headers: {
        authtoken,
      },
    });
  };



    //---- readreservationByid (อ่านประวัติการจองจาก room_id)
    export const readreservationByRoomid = async (authtoken, ID) => { 
      return await axios.get(`${process.env.REACT_APP_API}/reservationbyroomid/${ID}`, {
        headers: {
          authtoken,
        },
      });
    };

    
    //---- readreservationByRoomid YERE TERM(อ่านประวัติการใช้ห้องจาก room_id  yere term)
    export const readuseRoomByRoomidYereTerm = async (authtoken, ID,YERE,TERM) => { 
      return await axios.get(`${process.env.REACT_APP_API}/useroomroombyroomid/${ID}/${YERE}/${TERM}`, {
        headers: {
          authtoken,
        },
      });
    };
  
  
  //----deleteReservation   
export const deleteReservation = async (authtoken, id) => { 
  return await axios.delete(`${process.env.REACT_APP_API}/reservation/${id}`, {
    headers: {
      authtoken,
    },
  });
};