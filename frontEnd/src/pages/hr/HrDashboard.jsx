import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaUserTie, FaClock, FaFileAlt } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const HRDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [managerCount, setManagerCount] = useState(0);
  const [attendanceCount, setAttendance] = useState(0);
  const [leaves, setLeaves] = useState([]);
  const [holidays, setHolidays] = useState([]);

  const deptColors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  const statusColors = { Pending: "bg-red-500", Approved: "bg-green-500", Rejected: "bg-gray-400" };

  const formatToDDMMM = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    return `${day}-${month}`;
  };

  // Fetch Employees
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/registration/getAllEmployees")
      .then(res => {
        const allEmployees = res.data.data;
        setEmployees(allEmployees);
        setManagerCount(allEmployees.filter(e => e.roles_id === 2).length);
      })
      .catch(err => console.error(err));
  }, []);

  // Fetch Leaves
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/leave/get_all_leaves")
      .then(res => setLeaves(res.data))
      .catch(err => console.error(err));
  }, []);

   // Fetch Attendance
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/dashboard/attendance_count")
      .then(res => console.log("Fetching attendance data",res.data) || res.data.success && setAttendance(res.data.count)  )
      .catch(err => console.error(err));
  }, []);

  // Fetch Holidays
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/holidays/get_upcoming_holidays")
      .then(res => res.data.success && setHolidays(res.data.data))
      .catch(err => console.error(err));
  }, []);

  // Update leave status via API
 const updateLeaveStatus = (leave_id, status) => {
  // Optimistic UI update
  setLeaves(prevLeaves =>
    prevLeaves.map(l => (l.leave_id === leave_id ? { ...l, status } : l))
  );

  axios.put("http://127.0.0.1:8000/leave/update_status", {
    leave_id,
    status,
    approved_by: "HR",
  })
    .then(res => {
      console.log(res.data);
      if (!res.data.success) {
        setLeaves(prevLeaves =>
          prevLeaves.map(l => (l.leave_id === leave_id ? { ...l, status: "Pending" } : l))
        );
        console.error("Failed to update leave status");
      }else{
        setLeaves(prevLeaves =>
          prevLeaves.map(l => (l.leave_id === leave_id ? { ...l, status } : l))
        );
      }
    })
    .catch(err => {
      // Revert UI on error
      setLeaves(prevLeaves =>
        prevLeaves.map(l => (l.leave_id === leave_id ? { ...l, status: "Pending" } : l))
      );
      console.error("Error updating leave status:", err);
    });
};

  // Department distribution for Pie chart
  const departmentData = Object.values(employees.reduce((acc, emp) => {
    if (!acc[emp.department]) acc[emp.department] = { name: emp.department, value: 0 };
    acc[emp.department].value += 1;
    return acc;
  }, {}));

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
        {/* Department Distribution */}
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

        {/* Team Leaves */}
        <motion.div className="bg-white p-4 rounded-xl shadow-lg h-[300px]" whileHover={{ scale: 1.02 }}>
          <h2 className="text-sm font-semibold mb-2">Team Leaves</h2>
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
                    <span className={`px-2 py-1 rounded text-white text-xs ${statusColors[leave.status]}`}>
                      {leave.status}
                    </span>
                    {leave.status === "Pending" && (
                      <>
                        <button className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                          onClick={() => updateLeaveStatus(leave.leave_id, "Approved")}>✔</button>
                        <button className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                          onClick={() => updateLeaveStatus(leave.leave_id, "Rejected")}>✖</button>
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
        {/* Holidays */}
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

        {/* Payroll */}
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
    </div>
  );
};

export default HRDashboard;
