import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SunIcon, CloudIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import axios from "axios";
// Import your tab components
import ProfilePreview from "./Profile-preview";
import LeavePreview from "./Leave-preview";
import AttendancePreview from "./Attendance-preview";
import Holidays from "./Holidays";

export default function Home() {
  const [isCheckedIn, setCheckedIn] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [activeTab, setActiveTab] = useState("ppreview"); // default tab
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState(null);

  const tabs = [
    { path: "ppreview", label: "Profile" },
    { path: "lpreview", label: "Leave" },
    { path: "apreview", label: "Attendance" },
    { path: "holidays", label: "Holidays" },
  ];


  useEffect(() => {
    const employeeDataString = localStorage.getItem("employee");
    if (employeeDataString) {
      try {
        const employeeDataObject = JSON.parse(employeeDataString);
        setEmployee(employeeDataObject);
      } catch (e) {
        console.error("Error parsing employee data from localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/checkIn/status/1");
        if (res.data && res.data.checked_in) {
          setCheckedIn(true);

          // Calculate seconds elapsed from check-in timestamp
          const checkInTime = new Date(res.data.check_in_time); // backend must return ISO string
          const now = new Date();
          const elapsed = Math.floor((now - checkInTime) / 1000);
          setSecondsElapsed(elapsed);
        } else {
          setCheckedIn(false);
          setSecondsElapsed(0);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch check-in status!");
      }
    };
    fetchStatus();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isCheckedIn) {
      interval = setInterval(() => setSecondsElapsed(prev => prev + 1), 1000);
    } else {
      setSecondsElapsed(0);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn]);

  const formatTime = (sec) => {
    const hrs = String(Math.floor(sec / 3600)).padStart(2, "0");
    const mins = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const secs = String(sec % 60).padStart(2, "0");
    return [hrs, mins, secs];
  };
  const [hours, minutes, secs] = formatTime(secondsElapsed);

  // Map tab paths to components
  const tabComponents = {
    ppreview: ProfilePreview,
    lpreview: LeavePreview,
    apreview: AttendancePreview,
    holidays: Holidays,
  };

  const ActiveComponent = tabComponents[activeTab];

  const handleCheckIn = async () => {
    const payload = {
      emp_id: 1,
      manager_id: 2,
      ip_address: "123.645.3.2",
    };

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/checkIn/checkin", payload);
      if (res.data.success) {
        setCheckedIn(true);
        toast.success("Checked in successfully!");
      } else {
        toast.error("Failed to check in. Please try again.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        toast.error(err.response.data.detail);
      } else {
        toast.error("Error connecting to server!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    const payload = {
      emp_id: 1,
      manager_id: 2,
      ip_address: "123.645.3.2",
    };

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/checkIn/checkout", payload);
      if (res.data.success) {
        setCheckedIn(false);
        toast.success("Checked out successfully!");
      } else {
        toast.error("Failed to check out. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server!");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col lg:flex-row p-4 gap-4 h-full font-sans pb-0">

      {/* Left Panel */}
      <motion.div
        className="lg:w-1/4 bg-white p-6 rounded-xl flex flex-col items-center shadow-md"
        style={{
          maxHeight: "fit-content",
          boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset"
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
          <span className="text-gray-500 text-sm">{employee ? employee.emp_code : 'N/A'}</span> - {employee ? `${employee.firstName} ${employee.lastName}` : 'Loading name'}
        </h2>
        <p className="text-gray-600 text-sm mb-3 text-center">{employee ? employee.department : 'loading department..'}</p>
        <p className={`text-sm mb-4 text-center ${isCheckedIn ? "text-green-600" : "text-red-600"}`}>
          {isCheckedIn ? "Checked-in" : "Yet to check-in"}
        </p>

        {/* Timer */}
        <div className="flex items-center mb-4 gap-1">
          {[hours, minutes, secs].map((t, idx) => (
            <React.Fragment key={idx}>
              <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg font-semibold text-gray-800 shadow-md">
                <motion.span
                  key={t} // triggers animation whenever the value changes
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {t}
                </motion.span>
              </div>
              {idx < 2 && <span className="text-gray-800 font-semibold mx-2">:</span>}
            </React.Fragment>
          ))}
        </div>



        {/* Check In/Out Button */}
        <div className="flex flex-col gap-3 w-full">
          {!isCheckedIn ? (
            <motion.button
              onClick={handleCheckIn}
              disabled={loading}
              className="w-full py-2 border-2 border-green-400 bg-transparent text-green-500 font-semibold rounded-lg hover:bg-green-100 hover:text-green text-sm shadow-md transition-colors duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 010-16z"></path>
                  </svg>
                  Checking in...
                </>
              ) : (
                "Check In"
              )}
            </motion.button>
          ) : (
            <motion.button
              onClick={handleCheckOut}
              disabled={loading}
              className="w-full py-2 border-2 border-red-400 bg-transparent text-red-500 font-semibold rounded-lg hover:bg-red-100 hover:text-red text-sm shadow-md transition-colors duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 010-16z"></path>
                  </svg>
                  Checking out...
                </>
              ) : (
                "Check Out"
              )}
            </motion.button>
          )}

        </div>
      </motion.div>

      {/* Right Panel */}
      <div className="lg:w-3/4 flex flex-col gap-4 flex-1">

        <div
          className="relative w-full h-20 p-4 bg-gradient-to-r from-blue-200 to-blue-400 rounded-xl overflow-hidden flex items-center">

          {/* Left Content */}
          <motion.div
            className="relative z-10 "
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}

          >
            <h1 className="text-1xl font-bold text-gray-800">Good Morning, {employee?.firstName}</h1>
            <p className="text-gray-600 mt-1 text-sm">Have a productive day!</p>
          </motion.div>

          {/* Animated Sun on Right */}
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
            boxShadow: "0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05)"
          }}
        >
          <div className="h-full">
            <ActiveComponent isCheckedIn={isCheckedIn} hours={hours} minutes={minutes} secs={secs} />
          </div>
        </div>
      </div>
    </div>
  );
}
