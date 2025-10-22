import React, { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";
import { FaUsers, FaUserCheck, FaUserTimes, FaClipboardList, FaCalendarAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import jwt_decode from "jwt-decode";
import ConfirmStatusModal from "../../modals/leaveStatusChange";
import TotalTeamModal from "../../modals/manager/totalTeamModal";
import LeaveDetailsModal from "../../modals/manager/leaveDetails";
import { ManagerDashboardService } from "../../api/services/manager/ManagerDashboardService";
import { EmployeeOverViewService } from "../../api/services/manager/employeeOverViewService";

export default function ManagerDashboard() {
  const loggedInUserDetails = JSON.parse(localStorage.getItem("employee"));
  const [manager, setManager] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [attendanceCount, setAttendance] = useState(0);
  const [leaves, setLeaves] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [leaveStatusData, setLeaveStatus] = useState([]);
  const [upcomingHolidays, setHolidays] = useState([]);
  const [attendanceChart, setChartData] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ open: false, leaveId: null, action: "" });
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  const actionToDbStatus = {
    Approve: "Approved",
    Reject: "Rejected",
  };

  // Decode manager info from JWT token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwt_decode(token);
      if (decoded.id) {
        setManager({
          emp_id: decoded.id,
          manager_id: decoded.manager_id || null,
        });
      }
    } catch (err) {
      toast.error("Invalid token!");
    }
  }, []);
  useEffect(() => {
    if (!leaves.length) return;

    const updatedStatusData = [
      { name: "Approved", value: leaves.filter(l => l.manager_status === "Approved").length, color: "#86efac" },
      { name: "Pending", value: leaves.filter(l => l.manager_status === "Pending").length, color: "#fde68a" },
      { name: "Rejected", value: leaves.filter(l => l.manager_status === "Rejected").length, color: "#fca5a5" },
    ];

    setLeaveStatus(updatedStatusData);
  }, [leaves]);

  useEffect(() => {
    if (!manager?.emp_id) return;

    const fetchData = async () => {
      try {
        const [teamRes, attendanceRes, leavesRes, weeklyRes, holidaysRes] = await Promise.all([
          ManagerDashboardService.getTeamMembers(manager.emp_id),
          ManagerDashboardService.getAttendanceCount(manager.emp_id),
          ManagerDashboardService.getLeaves(manager.emp_id),
          ManagerDashboardService.getWeeklyAttendance(manager.emp_id),
          ManagerDashboardService.getUpcomingHolidays(),
        ]);

        if (teamRes.success) setTeamMembers(teamRes.data);
        if (attendanceRes.success) setAttendance(attendanceRes.count);

        if (leavesRes.success) {
          const allLeaves = leavesRes.data;
          setLeaves(allLeaves);
          setPendingLeaves(allLeaves.filter(l => l.manager_status === "Pending"));

          setLeaveStatus([
            { name: "Approved", value: allLeaves.filter(l => l.manager_status === "Approved").length, color: "#86efac" },
            { name: "Pending", value: allLeaves.filter(l => l.manager_status === "Pending").length, color: "#fde68a" },
            { name: "Rejected", value: allLeaves.filter(l => l.manager_status === "Rejected").length, color: "#fca5a5" },
          ]);
        }

        if (weeklyRes.data?.success) setChartData(weeklyRes.data.data);
        if (holidaysRes.success) setHolidays(holidaysRes.data);
      } catch (err) {
        toast.error("Failed to load dashboard data.");
      }
    };

    fetchData();
  }, [manager]);

  // Open modals
  const handleApproveClick = (leaveId) => setConfirmModal({ open: true, leaveId, action: "Approve" });
  const handleRejectClick = (leaveId) => setConfirmModal({ open: true, leaveId, action: "Reject" });

  // Confirm modal -> update leave status
  const handleConfirmLeave = async (leaveId, action) => {
    try {
      const payload = {
        leave_id: leaveId,
        status: action === "Approve" ? "Approved" : "Rejected",
        approved_by: `${loggedInUserDetails.firstName} ${loggedInUserDetails.lastName}`,
      };

      const res = await EmployeeOverViewService.updateLeaveStatus(payload);
      console.log("response:", res);

      if (res.success) {
        toast.success(`Leave ${action.toLowerCase()} successfully!`);

        const updatedLeaves = leaves.map(l =>
          l.leave_id === leaveId
            ? { ...l, manager_status: actionToDbStatus[action] }
            : l
        );

        setLeaves(updatedLeaves);
        setPendingLeaves(updatedLeaves.filter(l => l.manager_status === "Pending"));
        console.log("Updated Leaves:", updatedLeaves);
      } else {
        toast.error("Failed to update leave status.");
      }
    } catch (error) {
      console.error("Server error:", error);
      toast.error("Server error. Please try again.");
    } finally {
      setConfirmModal({ open: false, leaveId: null, action: "" });
    }
  };

  // Dashboard stats
  const totalTeam = teamMembers.length;
  const totalPending = pendingLeaves.length;
  const onLeaveToday = leaves.filter(l =>
    l.status === "Approved" && new Date(l.start_date).toDateString() === new Date().toDateString()
  ).length;

  return (
    <motion.div
      className="p-6 max-h-screen pb-20 overflow-auto z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6 font-sans">
        <SummaryCard title="Total Team" value={totalTeam} icon={<FaUsers className="text-blue-500" />} color="bg-blue-100" onClick={() => setTeamModalOpen(true)} />
        <SummaryCard title="Present Today" value={attendanceCount} icon={<FaUserCheck className="text-green-500" />} color="bg-green-100" />
        <SummaryCard title="On Leave" value={onLeaveToday} icon={<FaUserTimes className="text-red-500" />} color="bg-red-100" onClick={() => setLeaveModalOpen(true)} />
        <SummaryCard title="Pending Leaves" value={totalPending} icon={<FaClipboardList className="text-yellow-500" />} color="bg-yellow-100" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance */}
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <h2 className="text-md font-semibold text-gray-700 mb-3">Weekly Attendance</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceChart}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" stackId="a" fill="#10b981" />
              <Bar dataKey="absent" stackId="a" fill="#FDBA74" />
              <Bar dataKey="holiday" stackId="a" fill="#a3a3a3ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leave Status Pie Chart */}
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <h2 className="text-md font-semibold text-gray-700 mb-3">Leave Status</h2>
          {!leaveStatusData || leaveStatusData.length === 0 ? (
            <div className="flex items-center justify-center h-[250px] text-gray-400 text-sm">
              No leave data available 📊
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={leaveStatusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  innerRadius={40}
                  label
                >
                  {leaveStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Pending Leaves & Upcoming Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Pending Leaves */}
        <motion.div className="bg-white p-5 rounded-2xl shadow-md">
          <h2 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FaClipboardList className="text-yellow-500" /> Pending Leave Requests
          </h2>
          {pendingLeaves.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center h-[200px] text-gray-400 text-xs"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <span className="text-md text-purple-700">No pending leave requests 🎉</span>
            </motion.div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {pendingLeaves.map((leave) => (
                <div key={leave.leave_id} className="flex justify-between items-center border rounded-xl p-3 hover:bg-gray-50 transition">
                  <div>
                    <p className="font-semibold text-gray-700">{leave.first_name} {leave.last_name}</p>
                    <p className="text-xs text-gray-400">{leave.start_date} → {leave.end_date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApproveClick(leave.leave_id)} className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-200">Approve</button>
                    <button onClick={() => handleRejectClick(leave.leave_id)} className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-200">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Upcoming Holidays */}
        <motion.div className="bg-white p-5 rounded-2xl shadow-md">
          <h2 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-500" /> Upcoming Holidays
          </h2>
          {!upcomingHolidays || upcomingHolidays.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center h-[200px] text-gray-400 text-xs"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <span className="text-md text-purple-700">No upcoming holidays 🎉</span>
            </motion.div>
          ) : (
            <ul className="text-sm text-gray-600 space-y-2 max-h-80 overflow-y-auto">
              {upcomingHolidays.map((holiday, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-blue-50 rounded-lg px-3 py-2"
                >
                  <span>
                    {holiday.emoji} {holiday.description}
                  </span>
                  <span className="text-gray-500">
                    {new Date(holiday.date).toLocaleDateString("en-GB")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      {confirmModal.open && (
        <ConfirmStatusModal
          isOpen={confirmModal.open}
          status={confirmModal.action}
          onClose={() => setConfirmModal({ open: false, leaveId: null, action: "" })}
          onConfirm={() => handleConfirmLeave(confirmModal.leaveId, confirmModal.action)}
        />
      )}

      <TotalTeamModal isOpen={teamModalOpen} onClose={() => setTeamModalOpen(false)} teamMembers={teamMembers} />
      <LeaveDetailsModal
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        leaves={leaves.filter(l => l.status === "Approved" && new Date(l.start_date).toDateString() === new Date().toDateString())}
      />
    </motion.div>
  );
}

// SummaryCard Component
const SummaryCard = ({ title, value, icon, color, onClick }) => (
  <motion.div
    className={`p-5 font-sans rounded-2xl shadow-md flex justify-between items-center ${color} cursor-pointer`}
    whileHover={{ scale: 1.05 }}
    onClick={onClick}
  >
    <div>
      <h3 className="text-gray-700 font-semibold text-md">{title}</h3>
      <p className="text-md font-bold text-gray-800">{value}</p>
    </div>
    <div className="text-4xl opacity-80">{icon}</div>
  </motion.div>
);
