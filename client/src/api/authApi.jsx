import axios from "axios";



//----LOGIN----//todo testgood
export const login = async (value) => 
  await axios.post(process.env.REACT_APP_API+"/login", value); 


  
//----currentUser----   (Check token user)//todo testgood
export const currentUser = async (authtoken) => {  //get  token
    return await axios.post(process.env.REACT_APP_API + "/current-user",
      {},
      {
        headers: {   // send token from headers
          authtoken, //token
        },
      }
    );
  }
  
  //----currentAddmin----    (Check token admin)//todo testgood
  export const currentAdmin = async (authtoken) => { 
    return await axios.post(process.env.REACT_APP_API + "/current-admin",
      {},
      {
        headers: {  
          authtoken,
        },
      }
    );
  }