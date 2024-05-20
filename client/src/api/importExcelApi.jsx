import axios from "axios";



export const importStudent = async (authtoken, value) => {
    return await axios.post(process.env.REACT_APP_API + "/importstudent", value, {
      headers: {
        authtoken,
      },
    });
  };



       
export const importCourse = async (authtoken, value) => { 
    return await axios.post(process.env.REACT_APP_API + "/importcourse", value, {
      headers: {
        authtoken,
      },
    });
  };



