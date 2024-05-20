import axios from "axios";


//----CREATE Room  //todo testgood
export const createRoom = async (authtoken, value) => { 
    return await axios.post(process.env.REACT_APP_API + "/room", value, {
      headers: {
        authtoken,
      },
    });
  };

//----readAllRooms       //todo testgood
export const readAllRooms = async (authtoken) => {
    return await axios.get(process.env.REACT_APP_API + "/room", {
      headers: {
        authtoken, 
      },
    });
  };

//----readRoom 
export const readRoom = async (authtoken,id) => {
  return await axios.get(`${process.env.REACT_APP_API}/room/${id}`,{
    headers: {
        authtoken, 
      },
  });
};



//----readAllroomByRoomtype_id
export const readAllroomByRoomtype = async (id) =>
await axios.get(`${process.env.REACT_APP_API}/roombyroomtype/${id}`);





//----updateRoom   //todo testgood
export const updateRoom= async (authtoken, id, values) => {
    return await axios.put(`${process.env.REACT_APP_API}/room/${id}`,values, {
      headers: {
        authtoken
      }
    });
  };


//----deleteRoom    //todo testgood
export const deleteRoom = async (authtoken, id) => { //get Token and id
    return await axios.delete(`${process.env.REACT_APP_API}/room/${id}`, {
      headers: {
        authtoken,
      },
    });
  };

//------------------------------------  ROOM type--------------------------------------------------------------


export const createRoomType = async (authtoken, value) => { 
  return await axios.post(process.env.REACT_APP_API + "/roomtype", value, {
    headers: {
      authtoken,
    },
  });
};


export const readRoomType = async (authtoken,id) => {
return await axios.get(`${process.env.REACT_APP_API}/roomtype/${id}`,{
  headers: {
      authtoken, 
    },
});
};


export const readAllRoomsType = async () =>
await axios.get(process.env.REACT_APP_API + "/roomtype");



export const updateRoomType= async (authtoken, id, values) => {
  return await axios.put(`${process.env.REACT_APP_API}/roomtype/${id}`,values, {
    headers: {
      authtoken
    }
  });
};


export const deleteRoomType = async (authtoken, id) => { //get Token and id
  return await axios.delete(`${process.env.REACT_APP_API}/roomtype/${id}`, {
    headers: {
      authtoken,
    },
  });
};




