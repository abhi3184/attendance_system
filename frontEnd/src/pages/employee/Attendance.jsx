import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import jwt_decode from "jwt-decode";
import toast from "react-hot-toast";
import axios from "axios";
import { employeeAttendanceService } from "../../api/services/employee/employeeAttendance";
const statusColors = {
  present: "green-500",
  weekend: "yellow-500",
  leave: "red-500",
  holiday: "purple-500",
  absent: "red-500",
};

const statusText = {
  present: "Present",
  weekend: "Weekend",
  leave: "Leave",
  holiday: "Holiday",
  absent: "Absent",
};

const statusBorderColors = {
  present: "border-green-500",
  weekend: "border-yellow-500",
  leave: "border-red-500",
  holiday: "border-purple-400",
  absent: "border-red-400",
};

const Attendance = () => {
  const [employee, setEmployee] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [viewType, setViewType] = useState("monthly"); // ✅ define here
  const [loading, setLoading] = useState(false);

  // Decode JWT & set employee
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwt_decode(token);
      if (decoded.id) {
        setEmployee({
          emp_id: decoded.id,
          manager_id: decoded.manager_id,
        });
      }
    } catch (err) {
      // toast.error("Invalid token!");
    }
  }, []);

  // Fetch attendance data
  const fetchAttendance = async () => {
    if (!employee?.emp_id) return;
    setLoading(true);
    try {
      const res = await employeeAttendanceService.getAttendanceRecords(employee.emp_id, viewType);
      if (res.success && Array.isArray(res.data)) {
        const mappedData = res.data.map((item) => {
          const dateObj = new Date(item.date);
          const day = dateObj.getDate();
          const month = dateObj.toLocaleString("default", { month: "short" });

          const start = item.check_in_time
            ? new Date(item.check_in_time).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "00:00";

          const end = item.check_out_time
            ? new Date(item.check_out_time).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "00:00";

          return {
            date: day,
            month,
            start,
            end,
            hoursWorked: item.toatl_hr
              ? item.toatl_hr.toFixed(2)
              : "00:00",
            status: item.status.toLowerCase(),
            description: item.description || "-",
          };
        });
        setAttendanceData(mappedData);
      }
    } catch (err) {
      toast.error("Failed to fetch attendance!");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on load + when filter changes
  useEffect(() => {
    if (employee?.emp_id) fetchAttendance();
  }, [employee, viewType]);

  // Fetch CheckIn Status
  useEffect(() => {
    if (!employee?.emp_id) return;
    const fetchStatus = async () => {
      try {
        const res = await employeeAttendanceService.getStatus(employee.emp_id);
        if (res.success) {
          const { checked_in, check_in_time } = res;
          if (checked_in && check_in_time) {
            const checkInDate = new Date(check_in_time);
            const elapsed = Math.floor((new Date() - checkInDate) / 1000);
            setTimer(elapsed);
            setIsCheckedIn(true);
          } else {
            setTimer(0);
            setIsCheckedIn(false);
          }
        }
      } catch {
        toast.error("Failed to fetch check-in status!");
      }
    };
    fetchStatus();
  }, [employee]);

  // Timer logic
  useEffect(() => {
    if (isCheckedIn) {
      const id = setInterval(() => setTimer((prev) => prev + 1), 1000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [isCheckedIn]);

  const formatTime = (sec) => {
    const hours = String(Math.floor(sec / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const seconds = String(sec % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Header with filter and checkin */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-5xl flex items-center p-3 rounded-xl shadow-lg sticky mt-4  z-10"
      >
        <div className="text-sm font-semibold pl-5">
          IT General <span className="text-gray-500">[10:00 AM - 7:00 PM]</span>
        </div>

        {/* Filter */}
        <div className="absolute left-1/2 -translate-x-1/2 flex space-x-2">
          <button
            className={`px-3 py-1 rounded text-xs font-semibold ${
              viewType === "weekly"
                ? "bg-purple-500 text-white"
                : "bg-purple border text-gray-700"
            }`}
            onClick={() => setViewType("weekly")}
          >
            Weekly
          </button>
          <button
            className={`px-3 py-1 rounded text-xs font-semibold ${
              viewType === "monthly"
                ? "bg-purple-500 text-white"
                : "bg-purple border text-gray-700"
            }`}
            onClick={() => setViewType("monthly")}
          >
            Monthly
          </button>
        </div>

        {/* Check In / Out Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCheckedIn(!isCheckedIn)}
          className={`ml-auto flex flex-col items-center px-6 py-2 rounded-lg text-white font-semibold text-sm ${
            isCheckedIn ? "bg-red-500" : "bg-green-500"
          }`}
        >
          <span>{isCheckedIn ? "Check Out" : "Check In"}</span>
          <span className="text-sm font-mono mt-1">{formatTime(timer)}</span>
        </motion.button>
      </motion.div>

      {/* Attendance List */}
      <div
        className="max-w-5xl w-full mt-4 flex-1 overflow-y-auto space-y-3 pb-8 pr-3"
        style={{ maxHeight: "70vh" }}
      >
        {loading ? (
          <div className="text-center text-gray-500 py-4">
            Loading attendance...
          </div>
        ) : (
          attendanceData.map((item, idx) => {
            const color = statusColors[item.status] || "gray-400";
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white flex items-center p-3 rounded-xl shadow"
              >
                <div className="w-16 text-center">
                  <div className="text-sm font-semibold">{item.date}</div>
                  <div className="text-gray-500 text-sm">{item.month}</div>
                </div>

                <div className="flex-1 relative px-4">
                  <div
                    className={`absolute top-1/2 left-0 right-0 h-0.5 bg-${color}`}
                  ></div>
                  <div
                    className={`absolute top-1/2 left-0 w-3 h-3 -mt-1.5 rounded-full bg-gray-300`}
                  ></div>
                  <div
                    className={`absolute top-1/2 right-0 w-3 h-3 -mt-1.5 rounded-full bg-gray-300`}
                  ></div>

                  <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 border rounded text-sm bg-white ${statusBorderColors[item.status]} font-semibold text-center`}
                  >
                    {statusText[item.status] || item.status}
                  </div>
                </div>

                <div className="w-24 text-center flex flex-col items-center">
                  <div className="font-mono text-sm">
                    {item.hoursWorked || "00:00"}
                  </div>
                  <div className="text-gray-500 text-xs">Hrs</div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Attendance;
