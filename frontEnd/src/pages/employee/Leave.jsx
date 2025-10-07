import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaWallet, FaStethoscope, FaPlus } from "react-icons/fa";
import AddLeaveModal from "../../modals/addLeaveModal";
import jwt_decode from "jwt-decode";

// Upcoming holidays data
const upcomingHolidays = [
  { date: "2025-10-02", description: "Gandhi Jayanti" },
  { date: "2025-10-17", description: "Diwali" },
  { date: "2025-10-25", description: "Dussehra" },
];

const statusStyles = {
  Pending: { bg: "bg-yellow-50", text: "text-yellow-800" },
  Approved: { bg: "bg-green-50", text: "text-green-800" },
  Rejected: { bg: "bg-red-50", text: "text-red-800" },
};

const formatHolidayDate = (dateString) => {
  const date = new Date(dateString);
  const weekdays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const year = date.getFullYear();
  const weekday = weekdays[date.getDay()];
  return `${day}-${month}-${year} , ${weekday}`;
};

export default function Leave() {
  const [activeTab, setActiveTab] = useState("summary");
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const icons = [FaCalendarAlt, FaWallet, FaStethoscope];
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [employee, setEmployeeData] = useState(null);

  const handleCancel = (id) => setRequests((prev) => prev.filter((req) => req.id !== id));

  const fetchLeaveSummary = async (empId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/leave/leave_summary/${empId}`);
      if (response.data && Array.isArray(response.data)) {
        const colors = [
          { bgColor: "rgba(236, 253, 245, 1)", iconColor: "#22c55e" },
          { bgColor: "rgba(239, 246, 255, 1)", iconColor: "#2563eb" },
          { bgColor: "rgba(255, 247, 237, 1)", iconColor: "#f59e0b" },
        ];

        const formattedData = response.data.map((item, index) => ({
          id: index,
          label: item.leave_type,
          available: item.remaining_days,
          booked: item.used_days,
          icon: icons[index % icons.length],
          bgColor: colors[index % colors.length].bgColor,
          iconColor: colors[index % colors.length].iconColor,
        }));

        setSummaryData(formattedData);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveRequests = async (empId) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/leave/getLeavesById?empId=${empId}`);
      if (res.data && res.data.data) {
        setRequests(res.data.data); // assuming res.data.data is an array of leaves
      } else {
        console.error("Invalid API response:", res.data);
      }
    } catch (err) {
      console.error("Error fetching leave requests:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setEmployeeData(decoded);
        fetchLeaveSummary(decoded.id);
        fetchLeaveRequests(decoded.id)
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const handleAddLeave = async (data) => {
    const newRequest = { ...data, id: Date.now(), status: "Pending" };
    setRequests([...requests, newRequest]);
    setIsModalOpen(false);

    if (employee?.id) {
      fetchLeaveSummary(employee.id);
      fetchLeaveRequests(employee.id);
    }
  };

  return (
    <div className="p-6 max-h-screen bg-white rounded-xl shadow-md font-sans">
      {/* Tabs + Add Leave Button */}
      <div className="flex justify-between items-center border-b border-gray-300 mb-6 py-2">
        <div className="flex">
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-6 py-2 text-xs font-semibold ${activeTab === "summary"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            Leave Summary
          </button>
          <button
            onClick={() => setActiveTab("request")}
            className={`px-6 py-2 text-xs font-semibold ${activeTab === "request"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            Leave Requests
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white text-xs font-semibold rounded-lg shadow hover:shadow-lg transition-all duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="mr-2" /> Apply Leave
        </motion.button>
      </div>

      {/* Leave Summary */}
      {activeTab === "summary" && (
        <>
          {/* Summary Cards */}
          <div className="flex flex-wrap gap-6 mb-6">
            {loading ? (
              <p className="text-gray-500 text-sm">Loading summary...</p>
            ) : summaryData.length === 0 ? (
              <p className="text-gray-500 text-sm">No summary data available</p>
            ) : (
              summaryData.map((card) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.id}
                    onClick={() => {
                      setSelectedLeaveType(card.label);
                      setIsModalOpen(true);
                    }}
                    className="cursor-pointer flex-1 min-w-[220px] max-w-[220px] p-6 rounded-xl flex flex-col items-center justify-center shadow-md bg-white"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
                  >
                    <p className="text-sm font-semibold text-gray-700 mb-3">{card.label}</p>
                    <div
                      className="p-3 rounded-lg mb-4"
                      style={{ backgroundColor: card.bgColor, color: card.iconColor }}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex justify-between w-full mt-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 mb-1">Available</span>
                        <span className="text-xs font-medium text-gray-500">Booked</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-green-600 mb-1">{card.available}</span>
                        <span className="text-xs font-bold text-gray-800">{card.booked}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Upcoming Holidays Table */}
          <div className="bg-white rounded-xl border-gray-200 overflow-hidden">
            <h2 className="px-6 py-3 text-sm font-semibold border-b border-gray-200">
              Upcoming Holidays
            </h2>
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full divide-y rounded-xl divide-gray-200">
                <thead className="bg-purple-100 rounded-xl">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {upcomingHolidays.map((holiday, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-xs text-gray-700">
                        {formatHolidayDate(holiday.date)}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-700">{holiday.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Leave Requests */}
      {activeTab === "request" && (
        <div className="bg-white rounded-xl border-gray-200 overflow-hidden mt-4">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-purple-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Leave Type</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">From</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">To</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  {/* <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500 text-sm">
                      No leaves present
                    </td>
                  </tr>
                ) : (
                  requests.map((req, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-2 text-xs text-gray-700">{req.leave_type_id}</td>
                      <td className="px-4 py-2 text-xs text-gray-600">{req.start_date}</td>
                      <td className="px-4 py-2 text-xs text-gray-600">{req.end_date}</td>
                      <td className="px-4 py-2 text-xs">
                        <span
                          className={`inline-block w-20 text-center py-1 rounded-full text-xs font-semibold ${req.status === "Pending"
                              ? "bg-yellow-200 text-yellow-800"
                              : req.status === "Approved"
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-800"
                            }`}
                        >
                          {req.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>


            </table>
          </div>
        </div>
      )}

      <AddLeaveModal
        isOpen={isModalOpen}
        onSubmit={handleAddLeave}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLeaveType(null);
        }}
        preselectedType={selectedLeaveType}
      />
    </div>
  );
}
