import axios from "axios";


//----CREATELecturer //todo testgood
export const createLecturer= async (authtoken, value) => { 
    return await axios.post(process.env.REACT_APP_API + "/lecturer", value, {
      headers: {
        authtoken,
      },
    });
  };

//----readAllLecturer     //todo testgood
export const readAllLecturer= async (authtoken) => {
    return await axios.get(process.env.REACT_APP_API + "/lecturer", {
      headers: {
        authtoken, 
      },
    });
  };

//----readSubject
export const readLecturer= async (authtoken,id) => {
  return await axios.get(`${process.env.REACT_APP_API}/lecturer/${id}`,{
    headers: {
        authtoken, 
      },
  });
};




//----updateLecturer  //todo testgood
export const updateLecturer= async (authtoken, id, values) => {
    return await axios.put(`${process.env.REACT_APP_API}/lecturer/${id}`,values, {
      headers: {
        authtoken
      }
    });
  };


//----deleteLecturer   //todo testgood
export const deleteLecturer= async (authtoken, id) => { //get Token and id
    return await axios.delete(`${process.env.REACT_APP_API}/lecturer/${id}`, {
      headers: {
        authtoken,
      },
    });
  };
