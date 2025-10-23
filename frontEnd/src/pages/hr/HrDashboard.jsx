import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaUserTie, FaClock, FaFileAlt, FaCheck, FaTimes, FaCalendarAlt, FaCarSide } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "react-toastify";
import ConfirmStatusModal from "../../modals/leaveStatusChange";
import { hrleaveService } from "../../api/services/hrDashboard/HrleaveService";

import {
  getAllEmployees,
  getAllLeaves,
  getAttendanceCount,
  getUpcomingHolidays
} from "../../api/services/hrDashboard/hrDashboardService";

const HRDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendanceCount, setAttendance] = useState(0);
  const [holidays, setHolidays] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ open: false, leaveId: null, action: "" });

  const fetchCalled = useRef(false); // ✅ Ref to prevent double fetch

  const deptColors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const formatToDDMMM = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    return `${day}-${month}`;
  };

  // Fetch all dashboard data (once)
  useEffect(() => {
    if (fetchCalled.current) return; // skip if already called
    fetchCalled.current = true;

    const fetchData = async () => {
      try {
        const [emps, allLeaves, attendance, upcomingHolidays] = await Promise.all([
          getAllEmployees(),
          getAllLeaves(),
          getAttendanceCount(),
          getUpcomingHolidays(),
        ]);
        console.log("leaves", allLeaves.data)
        setEmployees(emps);
        setLeaves(allLeaves?.data || []);
        setAttendance(attendance);
        setHolidays(upcomingHolidays);
      } catch (err) {
        toast.error("Failed to fetch dashboard data");
      }
    };
    fetchData();
  }, []);

  // Count managers
  const managerCount = useMemo(() => employees.filter(e => e.roles_id === 2).length, [employees]);

  // Department distribution for PieChart
  const departmentData = useMemo(() => {
    return Object.values(
      employees.reduce((acc, emp) => {
        if (!acc[emp.department]) acc[emp.department] = { name: emp.department, value: 0 };
        acc[emp.department].value += 1;
        return acc;
      }, {})
    );
  }, [employees]);

  // Pending leaves (HR action pending)
  const pendingLeaves = useMemo(() => {
    if (!leaves || !Array.isArray(leaves)) return [];
    return leaves
      .filter(l => l.manager_status === "Approved" && l.hr_status === "Pending")
      .sort((a, b) => new Date(b.applied_on) - new Date(a.applied_on));
  }, [leaves]);

  // Approve/Reject leave
  const handleConfirmLeave = async (leaveId, action) => {
    try {
      const payload = {
        leave_id: leaveId,
        status: action === "Approve" ? "Approved" : "Rejected",
      };
      const res = await hrleaveService.updateLeaveStatus(payload);
      if (res.success) {
        toast.success(`Leave ${action.toLowerCase()} successfully!`);
        setLeaves(prev => prev.filter(l => l.leave_id !== leaveId));
      } else {
        toast.error(res.message || "Failed to update leave status");
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setConfirmModal({ open: false, leaveId: null, action: "" });
    }
  };

  const handleApproveClick = (leaveId) => setConfirmModal({ open: true, leaveId, action: "Approve" });
  const handleRejectClick = (leaveId) => setConfirmModal({ open: true, leaveId, action: "Reject" });

  return (
    <div className="p-4 font-sans h-[500px] space-y-6 overflow-auto">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <motion.div className="bg-indigo-50 p-4 rounded-xl shadow-lg flex justify-between items-center hover:scale-105 transition-transform">
          <div>
            <p className="text-xs text-indigo-800">Total Employees</p>
            <h2 className="text-2xl font-bold text-indigo-900">{employees.length}</h2>
          </div>
          <FaUsers className="text-3xl text-indigo-500" />
        </motion.div>

        <motion.div className="bg-emerald-50 p-4 rounded-xl shadow-lg flex justify-between items-center hover:scale-105 transition-transform">
          <div>
            <p className="text-xs text-emerald-800">Total Managers</p>
            <h2 className="text-2xl font-bold text-emerald-900">{managerCount}</h2>
          </div>
          <FaUserTie className="text-3xl text-emerald-500" />
        </motion.div>

        <motion.div className="bg-amber-50 p-4 rounded-xl shadow-lg flex justify-between items-center hover:scale-105 transition-transform">
          <div>
            <p className="text-xs text-amber-800">Pending Leaves</p>
            <h2 className="text-2xl font-bold text-amber-900">{pendingLeaves.length}</h2>
          </div>
          <FaFileAlt className="text-3xl text-amber-500" />
        </motion.div>

        <motion.div className="bg-purple-50 p-4 rounded-xl shadow-lg flex justify-between items-center hover:scale-105 transition-transform">
          <div>
            <p className="text-xs text-purple-800">Today's Attendance</p>
            <h2 className="text-2xl font-bold text-purple-900">{attendanceCount}</h2>
          </div>
          <FaClock className="text-3xl text-purple-500" />
        </motion.div>
      </div>

      {/* Charts + Leaves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Department Pie */}
        <motion.div className="bg-white p-4 rounded-xl shadow-lg" whileHover={{ scale: 1.02 }}>
          <h2 className="text-sm font-semibold mb-2">Department Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={departmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={deptColors[index % deptColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pending Leaves */}
        <motion.div className="bg-white p-5 rounded-2xl shadow-xl h-[350px] flex flex-col" whileHover={{ scale: 1.02 }}>
          <h2 className="text-md font-medium mb-4 text-gray-700 border-b pb-2">Pending Leaves</h2>
          <div className="flex-1 space-y-3 overflow-y-auto pr-2">
            {pendingLeaves.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-10 text-gray-500"
              >
                <div className="bg-purple-50 rounded-full p-6 shadow-sm mb-4">
                  <FaFileAlt className="text-purple-500 text-4xl" />
                </div>
                <h3 className="text-base font-semibold text-gray-700 mb-1">
                  No Employees Record Found
                </h3>
                <p className="text-xs text-gray-400 mb-4 text-center max-w-xs">
                  Try adjusting your search or add a new employee to get started.
                </p>
              </motion.div>
            ) : (
              pendingLeaves.map((leave) => (
                <div key={leave.leave_id} className="flex justify-between bg-blue-50 items-center p-3 border-l-4 border-blue-500 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 flex-col sm:flex-row">
                  <div className="flex flex-col rounded-xl">
                    {/* Employee Name */}
                    <p className="font-semibold text-sm text-gray-800 flex items-center mb-1">
                      <FaUserTie className="w-4 h-4 text-purple-600 mr-2" />
                      {leave.firstName} {leave.lastName}
                    </p>

                    {/* Department & Used Days */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        🏢 {leave.department || "N/A"}
                      </span>
                      <span className="text-gray-600 font-medium">
                        🟣 {leave.used_days} days used
                      </span>
                    </div>

                    {/* Leave Duration */}
                    <p className="text-xs text-gray-500 mt-2 border-t pt-1">
                      📅 {formatToDDMMM(leave.start_date)} → {formatToDDMMM(leave.end_date)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                    <span className="px-2 py-1 rounded-full text-black text-xs font-semibold">{leave.leave_name}</span>
                    <button onClick={() => handleApproveClick(leave.leave_id)} className="bg-green-100 hover:bg-green-200 text-green-800 p-1 rounded-md"><FaCheck /></button>
                    <button onClick={() => handleRejectClick(leave.leave_id)} className="bg-red-100 hover:bg-red-200 text-red-800 p-1 rounded-md"><FaTimes /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

      </div>

      {/* Holidays + Payroll */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Holidays */}
        <motion.div
          className="bg-white p-5 rounded-2xl shadow-lg"
          whileHover={{ scale: 1.03 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Upcoming Holidays</h2>
            <FaCalendarAlt className="text-purple-600 text-xl" />
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {holidays.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-12 text-gray-500"
              >
                <div className="bg-purple-100 rounded-full p-6 shadow-md mb-4">
                  <FaCalendarAlt className="text-purple-700 text-4xl" />
                </div>
                <h3 className="text-base font-semibold text-gray-700 mb-1">
                  No upcoming holidays found
                </h3>
                <p className="text-xs text-gray-400 text-center max-w-xs">
                  Add upcoming holidays to keep your team informed.
                </p>
              </motion.div>
            ) : (
              holidays.map((h, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-50 p-2 rounded-full">
                      <FaCalendarAlt className="text-purple-600 text-lg" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">{h.description}</p>
                  </div>
                  <p className="text-xs font-semibold text-orange-600">{formatToDDMMM(h.date)}</p>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Payroll */}
        <motion.div className="bg-white p-4 rounded-xl shadow-lg" whileHover={{ scale: 1.02 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Payroll</h2>
            <FaCalendarAlt className="text-purple-600 text-xl" />
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {employees.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-10 text-gray-500"
              >
                <div className="bg-purple-50 rounded-full p-6 shadow-sm mb-4">
                  <FaUsers className="text-purple-500 text-4xl" />
                </div>
                <h3 className="text-base font-semibold text-gray-700 mb-1">
                  No Employees Found On Payroll
                </h3>
                <p className="text-xs text-gray-400 text-center max-w-xs">
                  Add Employees to get in payroll.
                </p>
              </motion.div>
            ) : employees.map(emp => (
              <div key={emp.emp_id} className="flex justify-between items-center p-2 border rounded-xl hover:bg-gray-100 transition">
                <div>
                  <p className="font-semibold text-sm">{emp.firstName} {emp.lastName}</p>
                  <p className="text-xs text-gray-400">{emp.department}</p>
                </div>
                <p className={`text-xs font-semibold ${emp.salary > 50000 ? 'text-green-600' : 'text-red-500'}`}>
                  ₹{emp.salary}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {confirmModal.open && (
        <ConfirmStatusModal
          isOpen={confirmModal.open}
          status={confirmModal.action}
          onClose={() => setConfirmModal({ open: false, leaveId: null, action: "" })}
          onConfirm={() => handleConfirmLeave(confirmModal.leaveId, confirmModal.action)}
        />
      )}

    </div>
  );
};

export default HRDashboard;
