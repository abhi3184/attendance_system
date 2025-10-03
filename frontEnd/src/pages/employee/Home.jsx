import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SunIcon, CloudIcon } from "@heroicons/react/24/solid";

// Import your tab components
import ProfilePreview from "./Profile-preview";
import LeavePreview from "./Leave-preview";
import AttendancePreview from "./Attendance-preview";
import Holidays from "./Holidays";

export default function Home() {
  const [isCheckedIn, setCheckedIn] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [activeTab, setActiveTab] = useState("ppreview"); // default tab

  const tabs = [
    { path: "ppreview", label: "Profile" },
    { path: "lpreview", label: "Leave" },
    { path: "apreview", label: "Attendance" },
    { path: "holidays", label: "Holidays" },
  ];

  useEffect(() => {
    let interval = null;
    if (isCheckedIn) {
      interval = setInterval(() => setSecondsElapsed((prev) => prev + 1), 1000);
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
          <span className="text-gray-500 text-sm">AO1</span> - Abhijit Deshmukh
        </h2>
        <p className="text-gray-600 text-sm mb-3 text-center">Software Engineer</p>
        <p className={`text-sm mb-4 text-center ${isCheckedIn ? "text-green-600" : "text-red-600"}`}>
          {isCheckedIn ? "Checked-in" : "Yet to check-in"}
        </p>

        {/* Timer */}
        <div className="flex gap-2 mb-4">
          {[hours, minutes, secs].map((t, idx) => (
            <div
              key={idx}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg font-semibold text-gray-800 shadow-md"
            >
              {t}
            </div>
          ))}
        </div>

        {/* Check In/Out Button */}
        <div className="flex flex-col gap-3 w-full">
          {!isCheckedIn ? (
            <motion.button
              onClick={() => setCheckedIn(true)}
              className="w-full py-2 border-2 border-green-400 bg-transparent text-green-500 font-semibold rounded-lg hover:bg-green-100 hover:text-green text-sm shadow-md transition-colors duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Check In
            </motion.button>
          ) : (
            <motion.button
              onClick={() => setCheckedIn(false)}
              className="w-full py-2 border-2 border-red-400 bg-transparent text-red-500 font-semibold rounded-lg hover:bg-red-100 hover:text-red text-sm shadow-md transition-colors duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Check Out
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
            <h1 className="text-1xl font-bold text-gray-800">Good Morning, Abhijit</h1>
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
          <div className="min-h-full">
            <ActiveComponent isCheckedIn={isCheckedIn} hours={hours} minutes={minutes} secs={secs} />
          </div>
        </div>
      </div>
    </div>
  );
}
