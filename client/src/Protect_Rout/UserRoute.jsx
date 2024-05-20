//-----step 2------  Protect Rout URL User
import React from 'react'
import { useSelector } from 'react-redux'   
import LoadingToRedirect from './LoadingToRedirect' 


const UserRoute = ({children}) => {

    //get data in Redux
    const user = useSelector(state => state.auth.user)
        
    //console.log('userRoute',children)

    return user && user.token //check user and  user.token 
    ? children               //if have can go to  <HomeUser/>
    : <LoadingToRedirect /> // if don't have redirect to"/"
}

export default UserRoute
