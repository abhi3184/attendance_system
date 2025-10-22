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
import { employeeAttendanceService } from "../../api/services/employee/employeeAttendance";

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

  // Decode JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwt_decode(token);
      if (decoded.id && decoded.manager_id !== undefined) {
        setEmployee({ emp_id: decoded.id, manager_id: decoded.manager_id });
      }
    } catch (err) {}
  }, []);

  // Fetch all employee-related data once
  useEffect(() => {
    if (!employee?.emp_id) return;
    if (!firstLoad.current) return;

    const fetchAllEmployeeData = async () => {
      try {
        const empRes = await employeeHomeService.getEmployeeDetails(employee.emp_id);
        if (empRes.success && empRes.data) setEmployeeDetails(empRes.data);

        // Fetch today's check-in status from API
        await fetchStatus();

        const leaveRes = await employeeHomeService.getLeaveSummary(employee.emp_id);
        if (leaveRes) setLeaveSummary(leaveRes);

        const attRes = await employeeHomeService.getAttendanceRecords(employee.emp_id);
        if (attRes.success && Array.isArray(attRes.data)) setAttendanceData(attRes.data);
      } catch (err) {
        console.log(err);
      } finally {
        firstLoad.current = false;
      }
    };

    fetchAllEmployeeData();
  }, [employee]);

  // Fetch upcoming holidays
  useEffect(() => {
    if (holidaysFetched.current) return;
    holidaysFetched.current = true;

    const fetchUpcomingHolidays = async () => {
      try {
        const res = await employeeHomeService.getUpcominngHolidays();
        if (res.success && res.data) setHolidays(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUpcomingHolidays();
  }, []);

  // Fetch check-in status from API and calculate timer
  const fetchStatus = async () => {
    if (!employee?.emp_id) return;
    try {
      const res = await employeeAttendanceService.getStatus(employee.emp_id);
      if (res.success) {
        const { checked_in, check_in_time } = res;
        if (checked_in && check_in_time) {
          const elapsed = Math.floor((new Date() - new Date(check_in_time)) / 1000);
          setSecondsElapsed(elapsed);
          setCheckedIn(true);
        } else {
          setSecondsElapsed(0);
          setCheckedIn(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Timer logic: start/stop based on isCheckedIn
  useEffect(() => {
    let interval = null;
    if (isCheckedIn) {
      interval = setInterval(() => setSecondsElapsed((prev) => prev + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCheckedIn]);

  // Check-in handler
  const handleCheckIn = async () => {
    if (!employee?.emp_id) return;
    setLoadingCheck(true);
    try {
      const res = await employeeHomeService.handleCheckIn(employee);
      if (res.success) {
        toast.success("Checked in successfully!");
        await fetchStatus(); // fetch updated time from API
      } else {
        toast.error(res.message || "Check-in failed!");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingCheck(false);
    }
  };

  // Check-out handler
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
      console.log(err);
    } finally {
      setLoadingCheck(false);
    }
  };

  // Format seconds to HH:MM:SS
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

  return (
    <div className="flex flex-col lg:flex-row p-4 gap-6 h-full font-sans">
      {/* Left Panel */}
      <motion.div
        className="lg:w-1/4 bg-white p-6 rounded-2xl h-[350px] flex flex-col items-center shadow-lg"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Profile"
          className="w-24 h-24 rounded-full mb-3 shadow-md"
        />
        <h2 className="text-sm font-semibold text-gray-800 text-center">
          <span className="text-gray-400 text-xs">{employeeDetails?.emp_code || "N/A"}</span> -{" "}
          {employeeDetails ? `${employeeDetails.firstName} ${employeeDetails.lastName}` : "Loading..."}
        </h2>
        <p className="text-gray-500 text-xs mb-2 text-center">{employeeDetails?.department || "Loading..."}</p>
        <p className={`text-sm font-semibold mb-4 text-center ${isCheckedIn ? "text-green-600" : "text-red-600"}`}>
          {isCheckedIn ? "Checked-in" : "Yet to check-in"}
        </p>

        {/* Timer */}
        <div className="flex items-center mb-5 gap-1">
          {[hours, minutes, secs].map((t, idx) => (
            <React.Fragment key={idx}>
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg font-mono font-semibold text-gray-800 shadow-sm">
                {t}
              </div>
              {idx < 2 && <span className="mx-1 font-mono font-semibold text-gray-500">:</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Check In/Out */}
        <motion.button
          onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
          disabled={loadingCheck}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-2 rounded-lg font-semibold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2
            ${isCheckedIn ? "bg-red-600 text-white hover:bg-red-700" : "bg-green-600 text-white hover:bg-green-700"}`}
        >
          {loadingCheck ? (isCheckedIn ? "Checking out..." : "Checking in...") : isCheckedIn ? "Check Out" : "Check In"}
        </motion.button>
      </motion.div>

      {/* Right Panel */}
      <div className="lg:w-3/4 flex flex-col gap-6 flex-1">
        {/* Header */}
        <div className="relative w-full h-24 p-5 bg-gradient-to-r from-blue-200 to-blue-400 rounded-2xl overflow-hidden flex items-center">
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-lg md:text-xl font-bold text-gray-800">
              Good Morning, {employeeDetails?.firstName || "Employee"}
            </h1>
            <p className="text-gray-600 mt-1 text-sm font-medium">Have a productive day!</p>
          </motion.div>
          <motion.div
            className="absolute right-6"
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            <SunIcon className="h-12 w-12 text-yellow-400 drop-shadow-md" />
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.path;
            return (
              <motion.div
                key={tab.label}
                whileHover={{ scale: 1.03 }}
                className={`px-5 py-3 -mb-px text-sm font-medium transition-colors cursor-pointer ${
                  isActive ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-500 hover:text-purple-600"
                }`}
                onClick={() => setActiveTab(tab.path)}
              >
                {tab.label}
              </motion.div>
            );
          })}
        </div>

        {/* Active Tab Content */}
        <div className="flex-1 overflow-auto bg-white rounded-2xl p-4 shadow-sm">
          {activeTab === "lpreview" ? (
            <LeavePreview employee={employeeDetails} leaves={leaveSummary} />
          ) : activeTab === "ppreview" ? (
            <ProfilePreview employee={employeeDetails} />
          ) : activeTab === "holidays" ? (
            <Holidays holidays={holidays} />
          ) : (
            <AttendancePreview attendance={attendanceData} />
          )}
        </div>
      </div>
    </div>
  );
}
