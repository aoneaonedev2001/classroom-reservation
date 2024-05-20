import axios from "axios";



export const createYearsTerm= async (authtoken, value) => { 
    return await axios.post(process.env.REACT_APP_API + "/calendar", value, {
      headers: {
        authtoken,
      },
    });
  };


export const readAllYearsTerm= async (authtoken) => {
    return await axios.get(process.env.REACT_APP_API + "/calendar", {
      headers: {
        authtoken, 
      },
    });
  };


export const readYearsTerm= async (authtoken,yid,tid) => {
  return await axios.get(`${process.env.REACT_APP_API}/calendar/${yid}/${tid}`,{
    headers: {
        authtoken, 
      },
  });
};

//หาวันปีจากdate
export const readYearsTermFromday= async (id) => {
  return await axios.get(`${process.env.REACT_APP_API}/calendar/${id}`);
};





export const updateYearsTerm= async (authtoken, values) => {
    return await axios.put(`${process.env.REACT_APP_API}/calendar/`,values, {
      headers: {
        authtoken
      }
    });
  };



export const deleteYearsTerm= async (authtoken, yid, tid) => { 
    return await axios.delete(`${process.env.REACT_APP_API}/calendar/${yid}/${tid}`, {
      headers: {
        authtoken,
      },
    });
  };
