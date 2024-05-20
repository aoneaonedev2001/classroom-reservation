import axios from "axios";


//---- readCoursesByLecturer 
export const readCoursesByLecturer = async (authtoken, value) => { 
    return await axios.post(process.env.REACT_APP_API + "/course/readCoursesByLecturer", value, {
      headers: {
        authtoken,
      },
    });
  };

  //---- readCoursesByYereTerm 
export const readCoursesByYereTerm = async (authtoken, value) => { 
  return await axios.post(process.env.REACT_APP_API + "/course/readCoursesByYearTerm", value, {
    headers: {
      authtoken,
    },
  });
};


  
//----CREATECourse 
export const createCourse= async (authtoken, value) => { 
  return await axios.post(process.env.REACT_APP_API + "/importcourse", value, {
    headers: {
      authtoken,
    },
  });
};



//----readAllCourse    
export const readAllCourse= async (authtoken) => {
  return await axios.get(process.env.REACT_APP_API + "/course", {
    headers: {
      authtoken, 
    },
  });
};

//----readCourse
export const readCourse= async (authtoken,id) => {
return await axios.get(`${process.env.REACT_APP_API}/course/${id}`,{
  headers: {
      authtoken, 
    },
});
};




//----updateCourse  //todo testgood
export const updateCourse= async (authtoken, id, values) => {
  return await axios.put(`${process.env.REACT_APP_API}/course/${id}`,values, {
    headers: {
      authtoken
    }
  });
};


//----deleteCourse   //todo testgood
export const deleteCourse= async (authtoken, id) => { //get Token and id
  return await axios.delete(`${process.env.REACT_APP_API}/course/${id}`, {
    headers: {
      authtoken,
    },
  });
};







