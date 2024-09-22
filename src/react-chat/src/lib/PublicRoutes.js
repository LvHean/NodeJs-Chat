import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { API_TOKEN } from "../constants/api_constants";

const PublicRoutes = () => {
  const token = localStorage.getItem(API_TOKEN);
return (
  token ? <Navigate to='/home'/> : <Outlet/>
  )
}

export default PublicRoutes;
