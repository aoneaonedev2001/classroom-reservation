import axios from "axios";


//----CREATEStudent //todo testgood
export const createStudent= async (authtoken, value) => { 
    return await axios.post(process.env.REACT_APP_API + "/student", value, {
      headers: {
        authtoken,
      },
    });
  };

//----readAllStudent     //todo testgood
export const readAllStudent= async (authtoken) => {
    return await axios.get(process.env.REACT_APP_API + "/student", {
      headers: {
        authtoken, 
      },
    });
  };

//----readStudent
export const readStudent= async (authtoken,id) => {
  return await axios.get(`${process.env.REACT_APP_API}/student/${id}`,{
    headers: {
        authtoken, 
      },
  });
};




//----updateStudent  //todo testgood
export const updateStudent= async (authtoken, id, values) => {
    return await axios.put(`${process.env.REACT_APP_API}/student/${id}`,values, {
      headers: {
        authtoken
      }
    });
  };


//----deleteStudent   //todo testgood
export const deleteStudent= async (authtoken, id) => { //get Token and id
    return await axios.delete(`${process.env.REACT_APP_API}/student/${id}`, {
      headers: {
        authtoken,
      },
    });
  };
