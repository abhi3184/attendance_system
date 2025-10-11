import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SunIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import jwt_decode from "jwt-decode";

// Tab Components
import ProfilePreview from "./Profile-preview";
import LeavePreview from "./Leave-preview";
import AttendancePreview from "./Attendance-preview";
import Holidays from "./Holidays";

import { employeeHomeService } from "../../api/services/employee/employeeHome";

export default function Home() {
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [isCheckedIn, setCheckedIn] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [activeTab, setActiveTab] = useState("ppreview");
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [leaveSummary, setLeaveSummary] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  const firstLoad = useRef(true);
  const holidaysFetched = useRef(false);

  const tabs = [
    { path: "ppreview", label: "Profile" },
    { path: "lpreview", label: "Leave" },
    { path: "apreview", label: "Attendance" },
    { path: "holidays", label: "Holidays" },
  ];

  // Decode JWT once
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwt_decode(token);
      if (decoded.id && decoded.manager_id !== undefined) {
        setEmployee({ emp_id: decoded.id, manager_id: decoded.manager_id });
      } else {
        // toast.error("Invalid token structure!");
      }
    } catch (err) {
      // toast.error("Invalid token!");
    }
  }, []);

  // Fetch all employee-related data once
  useEffect(() => {
    if (!employee?.emp_id) return;
    if (!firstLoad.current) return;

    const fetchAllEmployeeData = async () => {
      try {
        // Employee Details
        const empRes = await employeeHomeService.getEmployeeDetails(employee.emp_id);
        if (empRes.success && empRes.data) setEmployeeDetails(empRes.data);

        // Attendance Status
        const statusRes = await employeeHomeService.fetchStatusToday(employee.emp_id);
        if (statusRes.checked_in && statusRes.check_in_time) {
          const checkInDate = new Date(statusRes.check_in_time);
          setSecondsElapsed(Math.floor((new Date() - checkInDate) / 1000));
          setCheckedIn(true);
        } else {
          setSecondsElapsed(0);
          setCheckedIn(false);
        }

        // Leave Summary
        const leaveRes = await employeeHomeService.getLeaveSummary(employee.emp_id);
        if (leaveRes) setLeaveSummary(leaveRes);

        // Attendance Records
        const attRes = await employeeHomeService.getAttendanceRecords(employee.emp_id);
        if (attRes.success && Array.isArray(attRes.data)) setAttendanceData(attRes.data);

      } catch (err) {
        toast.error("Failed to fetch employee data!");
      } finally {
        firstLoad.current = false; // Prevent duplicate calls in dev
      }
    };

    fetchAllEmployeeData();
  }, [employee]);

  // Fetch upcoming holidays (static)
  useEffect(() => {
    if (holidaysFetched.current) return; // prevent second call
    holidaysFetched.current = true;

    const fetchUpcomingHolidays = async () => {
      try {
        const res = await employeeHomeService.getUpcominngHolidays();
        if (res.success && res.data) setHolidays(res.data);
      } catch (err) {
        toast.error("Error fetching upcoming holidays!");
      }
    };

    fetchUpcomingHolidays();
  }, []);

  // Live timer
  useEffect(() => {
    if (!isCheckedIn) return;
    const interval = setInterval(() => setSecondsElapsed(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isCheckedIn]);

  // Format time
  const formatTime = (sec) => {
    const hrs = String(Math.floor(sec / 3600)).padStart(2, "0");
    const mins = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const secs = String(sec % 60).padStart(2, "0");
    return [hrs, mins, secs];
  };
  const [hours, minutes, secs] = formatTime(secondsElapsed);

  // Tabs
  const tabComponents = {
    ppreview: ProfilePreview,
    lpreview: LeavePreview,
    apreview: AttendancePreview,
    holidays: Holidays,
  };
  const ActiveComponent = tabComponents[activeTab];

  // Check-in
  const handleCheckIn = async () => {
    if (!employee?.emp_id) return;
    setLoadingCheck(true);
    try {
      const res = await employeeHomeService.handleCheckIn(employee);
      if (res.success) {
        setCheckedIn(true);
        toast.success("Checked in successfully!");
      } else {
        toast.error(res.message || "Check-in failed!");
      }
    } catch (err) {
      // toast.error(err?.response?.data?.detail || "Error connecting server!");
    } finally {
      setLoadingCheck(false);
    }
  };

  // Check-out
  const handleCheckOut = async () => {
    if (!employee?.emp_id) return;
    setLoadingCheck(true);
    try {
      const res = await employeeHomeService.handleCheckOut(employee.emp_id);
      if (res.success) {
        setCheckedIn(false);
        setSecondsElapsed(0);
        toast.success("Checked out successfully!");
      } else {
        toast.error(res.message || "Check-out failed!");
      }
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Error connecting server!");
    } finally {
      setLoadingCheck(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row p-4 gap-4 h-full font-sans pb-0">
      {/* Left Panel */}
      <motion.div
        className="lg:w-1/4 bg-white p-6 rounded-xl flex flex-col items-center shadow-md"
        style={{
          maxHeight: "fit-content",
          boxShadow:
            "rgba(50,50,93,0.25) 0px 50px 100px -20px, rgba(0,0,0,0.3) 0px 30px 60px -30px, rgba(10,37,64,0.35) 0px -2px 6px 0px inset",
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Profile"
          className="w-20 h-20 rounded-full mb-3 shadow-lg"
        />
        <h2 className="text-sm font-semibold text-gray-800 text-center">
          <span className="text-gray-500 text-sm">{employeeDetails?.emp_code || "N/A"}</span>{" "}
          -{" "}
          {employeeDetails
            ? `${employeeDetails.firstName || ""} ${employeeDetails.lastName || ""}`
            : "Loading..."}
        </h2>
        <p className="text-gray-600 text-sm mb-3 text-center">
          {employeeDetails?.department || "Loading..."}
        </p>
        <p className={`text-sm font-medium mb-4 text-center ${isCheckedIn ? "text-green-600" : "text-red-600"}`}>
          {isCheckedIn ? "Checked-in" : "Yet to check-in"}
        </p>

        {/* Timer */}
        <div className="flex items-center mb-4 gap-1">
          {[hours, minutes, secs].map((t, idx) => (
            <React.Fragment key={idx}>
              <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg font-semibold text-gray-800 shadow-md">
                {t}
              </div>
              {idx < 2 && <span className="mx-2">:</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Check In/Out Buttons */}
        <div className="flex flex-col gap-3 w-full">
          {!isCheckedIn ? (
            <motion.button
              onClick={handleCheckIn}
              disabled={loadingCheck}
              className="w-full py-2 border-2 border-green-400 bg-transparent text-green-500 font-semibold rounded-lg hover:bg-green-100 hover:text-green text-sm shadow-md transition-colors duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loadingCheck ? "Checking in..." : "Check In"}
            </motion.button>
          ) : (
            <motion.button
              onClick={handleCheckOut}
              disabled={loadingCheck}
              className="w-full py-2 border-2 border-red-400 bg-transparent text-red-500 font-semibold rounded-lg hover:bg-red-100 hover:text-red text-sm shadow-md transition-colors duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loadingCheck ? "Checking out..." : "Check Out"}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Right Panel */}
      <div className="lg:w-3/4 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="relative w-full h-20 p-4 bg-gradient-to-r from-blue-200 to-blue-400 rounded-xl overflow-hidden flex items-center">
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-1xl font-bold text-gray-800">
              Good Morning, {employeeDetails?.firstName || "Employee"}
            </h1>
            <p className="text-gray-500 mt-1 text-sm font-medium">Have a productive day!</p>
          </motion.div>
          <motion.div
            className="absolute right-6"
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            <SunIcon className="h-10 w-10 text-yellow-400 drop-shadow-lg" />
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 ">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.path;
            return (
              <motion.div
                key={tab.label}
                whileHover={{ scale: 1.03 }}
                className={`px-4 py-2 -mb-px text-sm font-semibold transition-colors cursor-pointer ${isActive
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-purple-600"
                  }`}
                onClick={() => setActiveTab(tab.path)}
              >
                {tab.label}
              </motion.div>
            );
          })}
        </div>

        {/* Active Tab Content */}
        <div
          className="flex-1 overflow-auto bg-white rounded-xl p-4"
          style={{
            maxHeight: "calc(100vh - 100px - 40px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          {activeTab === "lpreview" ? (
            <LeavePreview employee={employeeDetails} leaves={leaveSummary} />
          ) : activeTab === "ppreview" ? (
            <ProfilePreview
              employee={employeeDetails}
              isCheckedIn={isCheckedIn}
              hours={hours}
              minutes={minutes}
              secs={secs}
            />
          ) : activeTab === "holidays" ? (
            <Holidays holidays={holidays} />
          ) : activeTab === "apreview" ? (
            <AttendancePreview attendance={attendanceData} />
          ) : (
            <ActiveComponent
              employee={employeeDetails}
              isCheckedIn={isCheckedIn}
              hours={hours}
              minutes={minutes}
              secs={secs}
            />
          )}
        </div>
      </div>
    </div>
  );
}
