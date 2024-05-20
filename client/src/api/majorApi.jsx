import axios from "axios";



export const createMajor = async (authtoken, value) => { 
    return await axios.post(process.env.REACT_APP_API + "/major", value, {
      headers: {
        authtoken,
      },
    });
  };


export const readAllMajor = async (authtoken) => {
    return await axios.get(process.env.REACT_APP_API + "/major", {
      headers: {
        authtoken, 
      },
    });
  };


export const readMajor = async (authtoken,id) => {
  return await axios.get(`${process.env.REACT_APP_API}/major/${id}`,{
    headers: {
        authtoken, 
      },
  });
};





export const updateMajor= async (authtoken, id, values) => {
    return await axios.put(`${process.env.REACT_APP_API}/major/${id}`,values, {
      headers: {
        authtoken
      }
    });
  };



export const deleteMajor = async (authtoken, id) => { //get Token and id
    return await axios.delete(`${process.env.REACT_APP_API}/major/${id}`, {
      headers: {
        authtoken,
      },
    });
  };
