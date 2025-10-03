import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Leave from "../pages/Leave";
import Attendance from "../pages/Attendance";
import Login from "../auth/Login";
import MainLayout from "../layout/MainLayout";
import ForgotPassword from "../auth/ForgetPassword";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Login page */}
      <Route path="/login" element={<Login />} />
      <Route path="/forget" element={<ForgotPassword />} />

      {/* Dashboard routes wrapped in MainLayout */}
      <Route
        path="/home"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path="/leave"
        element={
          <MainLayout>
            <Leave />
          </MainLayout>
        }
      />
      <Route
        path="/attendance"
        element={
          <MainLayout>
            <Attendance />
          </MainLayout>
        }
      />

      {/* 404 */}
      <Route path="*" element={<div className="p-6">404 - Page Not Found</div>} />
    </Routes>
  );
}
