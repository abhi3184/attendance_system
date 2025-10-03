import React from "react";
import { Navigate } from "react-router-dom";
import { getDecodedToken } from "../utils/JWTHelper"; // your function to decode JWT
import Forbidden from "./Forbidden";
const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const decoded = token ? getDecodedToken(token) : null; // decode token

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(decoded.role)) {
    return <Forbidden />;
  }

  return children;
};

export default PrivateRoute;
