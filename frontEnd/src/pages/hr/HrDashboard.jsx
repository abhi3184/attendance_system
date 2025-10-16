import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaUserTie, FaClock, FaFileAlt, FaCheck, FaTimes } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "react-toastify";
import ConfirmStatusModal from "../../modals/leaveStatusChange";
import { hrleaveService } from "../../api/services/hrDashboard/HrleaveService"
import { getDecodedToken } from "../../utils/JWTHelper";

import {
  getAllEmployees,
  getAllLeaves,
  getAttendanceCount,
  getUpcomingHolidays,
  updateLeaveStatus
} from "../../api/services/hrDashboard/hrDashboardService";

const HRDashboard = () => {
  const loggedInUserDetails = JSON.parse(localStorage.getItem("employee"));
  const [employees, setEmployees] = useState([]);
  const [managerCount, setManagerCount] = useState(0);
  const [attendanceCount, setAttendance] = useState(0);
  const [leaves, setLeaves] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ open: false, leaveId: null, action: "" });
  const deptColors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  const statusColors = { Pending: "bg-red-500", Approved: "bg-green-500", Rejected: "bg-gray-400" };



  const token = localStorage.getItem("token"); // or your storage key
  const decoded = getDecodedToken(token);

  const formatToDDMMM = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    return `${day}-${month}`;
  };

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emps, allLeaves, attendance, upcomingHolidays] = await Promise.all([
          getAllEmployees(),
          getAllLeaves(),
          getAttendanceCount(),
          getUpcomingHolidays(),
        ]);
        setEmployees(emps);
        setManagerCount(emps.filter(e => e.roles_id === 2).length);
        setLeaves(allLeaves);
        setAttendance(attendance);
        setHolidays(upcomingHolidays);
      } catch (err) {
      }
    };
    fetchData();
  }, []);

  const handleConfirmLeave = async (leaveId, action) => {

    try {
      console.log("decoed",decoded)
      const payload = {
        leave_id: leaveId,
        status: action === "Approve" ? "Approved" : "Rejected",
        approved_by: `${loggedInUserDetails.firstName} ${loggedInUserDetails.lastName}`,
        hr_id: decoded.id
      };
      console.log("hiii", payload)
      const res = await hrleaveService.updateLeaveStatus(payload);
      if (res.success) {
        toast.success(`Leave ${action.toLowerCase()}d successfully!`);
        fetchTeamLeaves(employee.id);
      } else {
        toast.error(res.message || "Failed to update leave status");
      }
    } catch (err) {
    } finally {
      setConfirmModal({ open: false, leaveId: null, action: "" });
    }
  };


  // Department distribution for Pie chart
  const departmentData = Object.values(
    employees.reduce((acc, emp) => {
      if (!acc[emp.department]) acc[emp.department] = { name: emp.department, value: 0 };
      acc[emp.department].value += 1;
      return acc;
    }, {})
  );


  const handleApproveClick = (leaveId) => setConfirmModal({ open: true, leaveId, action: "Approve" });
  const handleRejectClick = (leaveId) => setConfirmModal({ open: true, leaveId, action: "Reject" });

  return (
    <div className="p-4 font-sans space-y-6 h-[500px] pb-5 overflow-auto">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <motion.div className="bg-indigo-50 p-4 rounded-xl shadow-lg flex flex-col justify-between hover:scale-105 transition-transform">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-indigo-800">Total Employees</p>
              <h2 className="text-2xl font-bold text-indigo-900">{employees.length}</h2>
            </div>
            <FaUsers className="text-3xl text-indigo-500" />
          </div>
        </motion.div>

        <motion.div className="bg-emerald-50 p-4 rounded-xl shadow-lg flex flex-col justify-between hover:scale-105 transition-transform">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-emerald-800">Total Managers</p>
              <h2 className="text-2xl font-bold text-emerald-900">{managerCount}</h2>
            </div>
            <FaUserTie className="text-3xl text-emerald-500" />
          </div>
        </motion.div>

        <motion.div className="bg-amber-50 p-4 rounded-xl shadow-lg flex flex-col justify-between hover:scale-105 transition-transform">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-amber-800">Pending Leaves</p>
              <h2 className="text-2xl font-bold text-amber-900">{leaves.filter(l => l.status === "Pending").length}</h2>
            </div>
            <FaFileAlt className="text-3xl text-amber-500" />
          </div>
        </motion.div>

        <motion.div className="bg-purple-50 p-4 rounded-xl shadow-lg flex flex-col justify-between hover:scale-105 transition-transform">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-purple-800">Today's Attendance</p>
              <h2 className="text-2xl font-bold text-purple-900">{attendanceCount}</h2>
            </div>
            <FaClock className="text-3xl text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Charts + Leaves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div className="bg-white p-4 rounded-xl shadow-lg" whileHover={{ scale: 1.02 }}>
          <h2 className="text-sm font-semibold mb-2">Department Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={departmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={deptColors[index % deptColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="bg-white p-4 rounded-xl shadow-lg h-[300px]" whileHover={{ scale: 1.02 }}>
          <h2 className="text-sm font-semibold mb-2">Leaves</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto pb-5">
            {leaves
              .slice()
              .sort((a, b) => a.status === "Pending" && b.status !== "Pending" ? -1 : b.status === "Pending" && a.status !== "Pending" ? 1 : 0)
              .map(leave => (
                <div key={leave.leave_id} className="flex justify-between items-center p-2 border rounded-xl hover:bg-gray-100 transition">
                  <div>
                    <p className="font-semibold text-sm">{leave.first_name} {leave.last_name}</p>
                    <p className="text-xs text-gray-400">{formatToDDMMM(leave.start_date)} → {formatToDDMMM(leave.end_date)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-white font-medium text-xs ${statusColors[leave.status]}`}>
                      {leave.leave_type}
                    </span>
                    {leave.status === "Approved By Manager" && (
                      <>
                        <button className="bg-green-500 text-red-700 px-2 py-1 rounded text-xs"
                          onClick={() => handleApproveClick(leave.leave_id, "Approved")} title="Approve">
                          <FaCheck className="w-3 h-3 text-green-900" /></button>
                        <button className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                          onClick={() => handleRejectClick(leave.leave_id, "Rejected")}>
                          <FaTimes className="w-3 h-3 text-red-900" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </div>

      {/* Holidays + Payroll */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div className="bg-white p-4 rounded-xl shadow-lg" whileHover={{ scale: 1.02 }}>
          <h2 className="text-sm font-semibold mb-2">Upcoming Holidays</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {holidays.map((h, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 border rounded-xl hover:bg-gray-100 transition">
                <p className="text-sm text-slate-700">{h.description}</p>
                <p className="text-xs text-orange-600">{formatToDDMMM(h.date)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="bg-white p-4 rounded-xl shadow-lg" whileHover={{ scale: 1.02 }}>
          <h2 className="text-sm font-semibold mb-2">Payroll</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {employees.map(emp => (
              <div key={emp.emp_id} className="flex justify-between items-center p-2 border rounded-xl hover:bg-gray-100 transition">
                <div>
                  <p className="font-semibold text-sm">{emp.firstName} {emp.lastname}</p>
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
          status={confirmModal.action} // Approve/Reject
          onClose={() => setConfirmModal({ open: false, leaveId: null, action: "" })}
          onConfirm={() => handleConfirmLeave(confirmModal.leaveId, confirmModal.action)}
        />
      )}
    </div>

  );
};

export default HRDashboard;
