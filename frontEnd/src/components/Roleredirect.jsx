import React from "react";
import { Navigate } from "react-router-dom";
import * as jwtDecode from "jwt-decode";
import { roleMap, roleHomePath } from "../utils/roleMap";

export default function RoleRedirect() {
  const token = localStorage.getItem("token");
  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode.default(token);
      role = roleMap[decoded.role];
    } catch (err) {
      role = null;
    }
  }

  if (!role) return <Navigate to="/login" replace />;

  return <Navigate to={roleHomePath[role]} replace />;
}
