import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const allAttendanceData = [
  { date: 3, month: "Oct", start: "10:00", end: "19:00", hoursWorked: "08:00", status: "present" },
  { date: 4, month: "Oct", start: "10:15", end: "19:00", hoursWorked: "07:45", status: "weekend" },
  { date: 5, month: "Oct", start: "10:00", end: "19:00", hoursWorked: "08:00", status: "leave" },
  { date: 6, month: "Oct", start: "-", end: "-", hoursWorked: "00:00", status: "holiday" },
  { date: 7, month: "Oct", start: "10:00", end: "19:00", hoursWorked: "08:00", status: "present" },
  { date: 8, month: "Oct", start: "10:00", end: "19:00", hoursWorked: "08:00", status: "present" },
  { date: 9, month: "Oct", start: "10:00", end: "19:00", hoursWorked: "08:00", status: "present" },
];

const statusColors = {
  present: "green-500",
  weekend: "yellow-400",
  leave: "red-500",
  holiday: "blue-500",
};

const statusText = {
  present: "Present",
  weekend: "Weekend",
  leave: "Absent",
  holiday: "Holiday",
};

const statusBorderColors = {
  present: "border-green-500",
  weekend: "border-yellow-400",
  leave: "border-red-500",
  holiday: "border-blue-400",
};

const Attendance = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [filter, setFilter] = useState("weekly"); // "weekly" or "monthly"
  const [attendanceData, setAttendanceData] = useState(allAttendanceData);

  useEffect(() => {
    if (isCheckedIn) {
      const id = setInterval(() => setTimer((prev) => prev + 1), 1000);
      setIntervalId(id);
    } else clearInterval(intervalId);
    return () => clearInterval(intervalId);
  }, [isCheckedIn]);

  // Filter data based on filter option
  useEffect(() => {
    if (filter === "weekly") {
      setAttendanceData(allAttendanceData.slice(-7)); // last 7 entries
    } else {
      setAttendanceData(allAttendanceData); // all data for monthly
    }
  }, [filter]);

  const handleCheckInOut = () => {
    setIsCheckedIn(!isCheckedIn);
    if (!isCheckedIn) setTimer(0);
  };

  const formatTime = (sec) => {
    const hours = String(Math.floor(sec / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const seconds = String(sec % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Top Check-In Card */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-5xl relative flex items-center p-3 rounded-xl shadow-lg sticky top-4 z-10"
      >
        {/* Left: IT General */}
        <div className="text-sm font-semibold pl-5">
          IT General <span className="text-gray-500">[ 10:00 AM - 7:00 PM ]</span>
        </div>

        {/* Center: Filter Buttons */}
        <div className="absolute left-1/2 -translate-x-1/2 flex space-x-2">
          <button
            className={`px-2 py-1 rounded text-xs ${filter === "weekly" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"
              } font-semibold`}
            onClick={() => setFilter("weekly")}
          >
            Weekly
          </button>
          <button
            className={`px-2 py-1 rounded text-xs ${filter === "monthly" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"
              } font-semibold`}
            onClick={() => setFilter("monthly")}
          >
            Monthly
          </button>
        </div>

        {/* Right: Check In / Check Out */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCheckInOut}
          className={`ml-auto flex flex-col items-center px-6 py-2 rounded-lg text-white font-semibold text-sm ${isCheckedIn ? "bg-red-500" : "bg-green-500"
            }`}
          style={{ fontFamily: "sans-serif" }}
        >
          <span>{isCheckedIn ? "Check Out" : "Check In"}</span>
          <span className="text-sm font-mono mt-1">{formatTime(timer)}</span>
        </motion.button>
      </motion.div>



      {/* Scrollable Attendance List */}
      <div
        className="max-w-5xl w-full mt-2 flex-1 overflow-y-auto space-y-3 pb-8 mt-8"
        style={{ maxHeight: "70vh" }}
      >
        {attendanceData.map((item, idx) => {
          const color = statusColors[item.status];

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white flex items-center p-3 rounded-xl shadow"
            >
              {/* Left: Date */}
              <div className="w-16 text-center">
                <div className="text-sm font-semibold">{item.date}</div>
                <div className="text-gray-500 text-sm">{item.month}</div>
              </div>

              {/* Center: Timeline */}
              <div className="flex-1 relative px-4">
                <div className={`absolute top-1/2 left-0 right-0 h-0.5 bg-${color}`}></div>
                <div className={`absolute top-1/2 left-0 w-3 h-3 -mt-1.5 rounded-full bg-${color}`}></div>
                <div className={`absolute top-1/2 right-0 w-3 h-3 -mt-1.5 rounded-full bg-${color}`}></div>

                {/* Center Text Box: Time + Status */}
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 border rounded text-sm bg-white ${statusBorderColors[item.status]} font-semibold text-center`}
                >

                  <div>{statusText[item.status]}</div>
                </div>
              </div>

              {/* Right: Hours Worked & Status */}
              <div className="w-24 text-center flex flex-col items-center">
                <div className="font-mono text-sm">{item.hoursWorked}</div>
                <div className="text-gray-500 text-xs">Hrs worked</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Attendance;
