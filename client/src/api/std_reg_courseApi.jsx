import axios from "axios";

 
 //todo testgood
export const createStudentInCourse= async (authtoken, value) => { 
  return await axios.post(process.env.REACT_APP_API + "/std_reg_course", value, {
    headers: {
      authtoken,
    },
  });
};

//todo testgood
export const readAllStudentInCourse= async (authtoken) => {
  return await axios.get(process.env.REACT_APP_API + "/std_reg_course", {
    headers: {
      authtoken, 
    },
  });
};

//todo testgood
export const readStudentInCourseByCourse_id = async (authtoken,id) => {
return await axios.get(`${process.env.REACT_APP_API}/std_reg_course/${id}`,{
  headers: {
      authtoken, 
    },
});
};



  //todo testgood
export const deleteStudentInCourse= async (authtoken,sid,cid) => { //get Token and id
  return await axios.delete(`${process.env.REACT_APP_API}/std_reg_course/${sid}/${cid}`, {
    headers: {
      authtoken,
    },
  });
};







