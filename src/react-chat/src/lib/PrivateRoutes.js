import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { API_TOKEN } from "../constants/api_constants";

const PrivateRoutes = () => {
  const token = localStorage.getItem(API_TOKEN);
return (
  token ? <Outlet/> : <Navigate to='/login'/>
  )
}

export default PrivateRoutes;
