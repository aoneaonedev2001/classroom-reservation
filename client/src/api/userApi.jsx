import axios from "axios";



export const createUser= async (authtoken, value) => { 
    return await axios.post(process.env.REACT_APP_API + "/register", value, {
      headers: {
        authtoken,
      },
    });
  };


export const readAllUser= async (authtoken) => {
    return await axios.get(process.env.REACT_APP_API + "/user", {
      headers: {
        authtoken, 
      },
    });
  };


export const readUser= async (authtoken,id) => {
  return await axios.get(`${process.env.REACT_APP_API}/user/${id}`,{
    headers: {
        authtoken, 
      },
  });
};





export const updateUser= async (authtoken, values) => {
    return await axios.put(`${process.env.REACT_APP_API}/user`,values, {
      headers: {
        authtoken
      }
    });
  };

  export const updatePassword= async (authtoken, values) => {
    return await axios.put(`${process.env.REACT_APP_API}/user/updatepassword`,values, {
      headers: {
        authtoken
      }
    });
  };



export const deleteUser= async (authtoken, id) => { 
    return await axios.delete(`${process.env.REACT_APP_API}/user/${id}`, {
      headers: {
        authtoken,
      },
    });
  };
