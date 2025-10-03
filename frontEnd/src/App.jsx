import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/MainLayout";
import PrivateRoute from "./components/ProtectedRoutes";
import RoleRedirect from "./components/Roleredirect";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = lazy(() => import("./auth/Login"));
const Home = lazy(() => import("./pages/employee/Home"));
const Leave = lazy(() => import("./pages/employee/Leave"));
const Attendance = lazy(() => import("./pages/employee/Attendance"));
const ManagerDashboard = lazy(() => import("./pages/manager/ManagerDashbord"));
const ManagerLeave = lazy(() => import("./pages/manager/ManagerLeave"));
const TeamOverview = lazy(() => import("./pages/manager/TeamOverview"));
const ManagerAttendance = lazy(() => import("./pages/manager/ManagerAttendance"));
const EmployeeManagement = lazy(() => import("./pages/hr/EmployeeManagement"));
const LeaveRequests = lazy(() => import("./pages/hr/LeaveRequest"));
const HrAttendance = lazy(() => import("./pages/hr/HrAttendance"));
const Payroll = lazy(() => import("./pages/hr/PayrollManage"));
const Holiday = lazy(() => import("./pages/hr/Holidays"));

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<RoleRedirect />} />

            {/* Employee routes */}
            <Route path="home" element={<PrivateRoute allowedRoles={['Employee']}><Home /></PrivateRoute>} />
            <Route path="leave" element={<PrivateRoute allowedRoles={['Employee']}><Leave /></PrivateRoute>} />
            <Route path="attendance" element={<PrivateRoute allowedRoles={['Employee']}><Attendance /></PrivateRoute>} />

            {/* Manager routes */}
            <Route path="mhome" element={<PrivateRoute allowedRoles={['Manager']}><ManagerDashboard /></PrivateRoute>} />
            <Route path="mleave" element={<PrivateRoute allowedRoles={['Manager']}><ManagerLeave /></PrivateRoute>} />
            <Route path="overview" element={<PrivateRoute allowedRoles={['Manager']}><TeamOverview /></PrivateRoute>} />
            <Route path="mattendance" element={<PrivateRoute allowedRoles={['Manager']}><ManagerAttendance /></PrivateRoute>} />

            {/* HR routes */}
            <Route path="emanagement" element={<PrivateRoute allowedRoles={['Hr']}><EmployeeManagement /></PrivateRoute>} />
            <Route path="eleave" element={<PrivateRoute allowedRoles={['Hr']}><LeaveRequests /></PrivateRoute>} />
            <Route path="hattendance" element={<PrivateRoute allowedRoles={['Hr']}><HrAttendance /></PrivateRoute>} />
            <Route path="payroll" element={<PrivateRoute allowedRoles={['Hr']}><Payroll /></PrivateRoute>} />
            <Route path="hrhome" element={<PrivateRoute allowedRoles={['Hr']}><Home /></PrivateRoute>} />
            <Route path="holiday" element={<PrivateRoute allowedRoles={['Hr']}><Holiday /></PrivateRoute>} />

          </Route>
          <Route path="*" element={<div>404 - page not found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
