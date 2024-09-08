import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoutes() {
  const token = localStorage.getItem("token");
    if (token == null){
      return(<Navigate to="/"/>);
    }else{
      return(
        <Outlet/>
      );
    }
}

export default PrivateRoutes