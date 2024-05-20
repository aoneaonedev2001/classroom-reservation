import axios from "axios";


//----CREATESubject  //todo testgood
export const createSubject = async (authtoken, value) => { 
    return await axios.post(process.env.REACT_APP_API + "/subject", value, {
      headers: {
        authtoken,
      },
    });
  };

//----readAllSubject      //todo testgood
export const readAllSubject = async (authtoken) => {
    return await axios.get(process.env.REACT_APP_API + "/subject", {
      headers: {
        authtoken, 
      },
    });
  };

//----readSubject
export const readSubject = async (authtoken,id) => {
  return await axios.get(`${process.env.REACT_APP_API}/subject/${id}`,{
    headers: {
        authtoken, 
      },
  });
};




//----updateSubject   //todo testgood
export const updateSubject= async (authtoken, id, values) => {
    return await axios.put(`${process.env.REACT_APP_API}/subject/${id}`,values, {
      headers: {
        authtoken
      }
    });
  };


//----deleteSubject    //todo testgood
export const deleteSubject = async (authtoken, id) => { //get Token and id
    return await axios.delete(`${process.env.REACT_APP_API}/subject/${id}`, {
      headers: {
        authtoken,
      },
    });
  };
