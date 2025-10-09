import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaClipboardList,
  FaCalendarAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import jwt_decode from "jwt-decode";
import ConfirmStatusModal from "../../modals/leaveStatusChange";

// Sample static data (can be replaced later)
const attendanceData = [
  { name: "Mon", present: 10, absent: 2 },
  { name: "Tue", present: 11, absent: 1 },
  { name: "Wed", present: 9, absent: 3 },
  { name: "Thu", present: 10, absent: 2 },
  { name: "Fri", present: 12, absent: 0 },
];

const upcomingHolidays = [
  { name: "Diwali", date: "29 Oct 2025", emoji: "🎉" },
  { name: "Bhai Dooj", date: "31 Oct 2025", emoji: "🪔" },
  { name: "Christmas", date: "25 Dec 2025", emoji: "🎄" },
];

export default function ManagerDashboard() {
  const [manager, setManager] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [attendanceCount, setAttendance] = useState(0);
  const [leaves, setLeaves] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [leaveStatusData, setLeaveStatus] = useState([]);
  const [upcomingHolidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    id: null,
    action: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwt_decode(token);
      if (decoded.id !== undefined) {
        setManager({
          emp_id: decoded.id,
          manager_id: decoded.manager_id || null,
        });
      } else {
        toast.error("Invalid token structure!");
      }
    } catch (err) {
      console.error("Invalid token", err);
      toast.error("Invalid token!");
    }
  }, []);

  useEffect(() => {
    if (!manager?.emp_id) return;
    axios
      .get(
        `http://127.0.0.1:8000/registration/get_employee_by_manager/${manager.emp_id}`
      )
      .then((res) => {
        if (res.data.success) {
          setTeamMembers(res.data.data);
        }
      })
      .catch((err) => console.error(err));
  }, [manager]);


  useEffect(() => {
    if (!manager?.emp_id) return;
    axios
      .get(
        `http://127.0.0.1:8000/dashboard/attendance_count_by_manager/${manager.emp_id}`
      )
      .then((res) => res.data.success && setAttendance(res.data.count))
      .catch((err) => console.error(err));
  }, [manager]);


  useEffect(() => {
    if (!manager?.emp_id) return;

    axios
      .get(`http://127.0.0.1:8000/leave/getLeavesByManagerID/${manager.emp_id}`)
      .then((res) => {
        if (res.data.success) {
          const allLeaves = res.data.data;
          setLeaves(allLeaves);
          setPendingLeaves(allLeaves.filter((l) => l.status === "Pending"));
          setLeaveStatus([
            {
              name: "Approved",
              value: allLeaves.filter((l) => l.status === "Approved").length,
              color: "#86efac",
            },
            {
              name: "Pending",
              value: allLeaves.filter((l) => l.status === "Pending").length,
              color: "#fde68a",
            },
            {
              name: "Rejected",
              value: allLeaves.filter((l) => l.status === "Rejected").length,
              color: "#fca5a5",
            },
          ]);
          setLoading(false);
        }
      })
      .catch((err) => console.error(err));
  }, [manager]);

  const handleApprove = (id) =>
    setConfirmModal({ open: true, id, action: "Approved" });
  const handleReject = (id) =>
    setConfirmModal({ open: true, id, action: "Rejected" });

  const handleConfirm = async () => {
    try {
      const payload = {
        leave_id: confirmModal.id,
        status: confirmModal.action,
        approved_by: "HR",
      };

      const res = await axios.put(
        "http://127.0.0.1:8000/leave/update_status",
        payload
      );

      if (res.data.success || res.status === 200) {
        toast.success(`Leave ${confirmModal.action.toLowerCase()} successfully!`);

        const updatedLeaves = leaves.map((leave) =>
          leave.leave_id === confirmModal.id
            ? { ...leave, status: confirmModal.action }
            : leave
        );

        setLeaves(updatedLeaves);
        setPendingLeaves(
          updatedLeaves.filter((l) => l.status === "Pending")
        );

        setLeaveStatus([
          {
            name: "Approved",
            value: updatedLeaves.filter((l) => l.status === "Approved").length,
            color: "#86efac",
          },
          {
            name: "Pending",
            value: updatedLeaves.filter((l) => l.status === "Pending").length,
            color: "#fde68a",
          },
          {
            name: "Rejected",
            value: updatedLeaves.filter((l) => l.status === "Rejected").length,
            color: "#fca5a5",
          },
        ]);
      } else {
        toast.error("Failed to update leave status.");
      }
    } catch (err) {
      toast.error("Server error. Please try again.");
      console.error(err);
    } finally {
      setConfirmModal({ open: false, id: null, action: "" });
    }
  };

  const totalTeam = teamMembers.length;
  const totalPending = leaves.filter((l) => l.status === "Pending").length;
  const onLeaveToday = leaves.filter(
    (l) =>
      l.status === "Approved" &&
      new Date(l.start_date).toDateString() === new Date().toDateString()
  ).length;

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/holidays/get_upcoming_holidays")
      .then(res => res.data.success && setHolidays(res.data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <motion.div
      className="p-6 max-h-screen pb-20 overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 🧩 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6 font-sans">
        <SummaryCard
          title="Total Team"
          value={totalTeam}
          icon={<FaUsers className="text-blue-500" />}
          color="bg-blue-100"
        />
        <SummaryCard
          title="Present Today"
          value={attendanceCount}
          icon={<FaUserCheck className="text-green-500" />}
          color="bg-green-100"
        />
        <SummaryCard
          title="On Leave"
          value={onLeaveToday}
          icon={<FaUserTimes className="text-red-500" />}
          color="bg-red-100"
        />
        <SummaryCard
          title="Pending Leaves"
          value={totalPending}
          icon={<FaClipboardList className="text-yellow-500" />}
          color="bg-yellow-100"
        />
      </div>

      {/* 📊 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <motion.div
          className="bg-white p-5 rounded-2xl shadow-md"
          whileHover={{ scale: 1.01 }}
        >
          <h2 className="text-md font-semibold text-gray-700 mb-3">
            Weekly Attendance
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceData}>
              <XAxis dataKey="name" className="text-sm" />
              <YAxis className="text-sm" />
              <Tooltip />
              <Bar dataKey="present" stackId="a" fill="#10b981" />  {/* emerald-500 */}
              <Bar dataKey="absent" stackId="a" fill="#FDBA74" />   {/* orange-300 */}
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Leave Status Pie */}
        <motion.div
          className="bg-white p-5 rounded-2xl shadow-md"
          whileHover={{ scale: 1.01 }}
        >
          <h2 className="text-md font-semibold text-gray-700 mb-3">
            Leave Status
          </h2>
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
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* 📝 Pending Leaves & 📅 Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Pending Leaves */}
        <motion.div
          className="bg-white p-5 rounded-2xl shadow-md"
          whileHover={{ scale: 1.01 }}
        >
          <h2 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FaClipboardList className="text-yellow-500" /> Pending Leave Requests
          </h2>
          {pendingLeaves.length === 0 ? (
            <p className="text-gray-400 text-sm">No pending leave requests 🎉</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {pendingLeaves.map((leave) => (
                <div
                  key={leave.leave_id}
                  className="flex justify-between items-center border rounded-xl p-3 hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-700">
                      {leave.first_name} {leave.last_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {leave.start_date} → {leave.end_date}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(leave.leave_id)}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(leave.leave_id)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-200"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Upcoming Holidays */}
        <motion.div
          className="bg-white p-5 rounded-2xl shadow-md"
          whileHover={{ scale: 1.01 }}
        >
          <h2 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-500" /> Upcoming Holidays
          </h2>
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
                  {new Date(holiday.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Confirm Modal */}
      <ConfirmStatusModal
        isOpen={confirmModal.open}
        onClose={() =>
          setConfirmModal({ open: false, id: null, action: "" })
        }
        onConfirm={handleConfirm}
        status={confirmModal.action}
      />
    </motion.div>
  );
}

// 🌈 Summary Card Component
const SummaryCard = ({ title, value, icon, color }) => (
  <motion.div
    className={`p-5 font-sans rounded-2xl shadow-md flex justify-between items-center ${color}`}
    whileHover={{ scale: 1.05 }}
  >
    <div>
      <h3 className="text-gray-700 font-semibold text-md">{title}</h3>
      <p className="text-md font-bold text-gray-800">{value}</p>
    </div>
    <div className="text-4xl opacity-80">{icon}</div>
  </motion.div>
);
