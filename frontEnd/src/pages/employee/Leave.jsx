import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaWallet, FaStethoscope, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import AddLeaveModal from "../../modals/addLeaveModal";
// Summary cards data
const summaryData = [
  {
    id: 1,
    label: "Earned Leave",
    type: "earned",
    icon: FaCalendarAlt,
    booked: 3,
    available: 5,
    iconColor: "#96bc42",
    bgColor: "#96bc4233",
  },
  {
    id: 2,
    label: "Leave Without Pay",
    type: "pending",
    icon: FaWallet,
    booked: 3,
    available: 5,
    iconColor: "#e05654",
    bgColor: "#e0565433",
  },
  {
    id: 3,
    label: "Sick Leave",
    type: "sick",
    icon: FaStethoscope,
    booked: 3,
    available: 5,
    iconColor: "#a78bfa",
    bgColor: "#a78bfa33",
  },
];

// Leave requests data
const leaveRequests = [
  { id: 1, type: "Casual Leave", from: "2025-10-05", to: "2025-10-07", status: "Pending" },
  { id: 2, type: "Sick Leave", from: "2025-10-10", to: "2025-10-12", status: "Approved" },
  { id: 3, type: "Earned Leave", from: "2025-10-15", to: "2025-10-16", status: "Rejected" },
  { id: 4, type: "Casual Leave", from: "2025-10-18", to: "2025-10-20", status: "Pending" },
  { id: 5, type: "Sick Leave", from: "2025-10-22", to: "2025-10-23", status: "Approved" },
];

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

  const handleCancel = (id) => setRequests((prev) => prev.filter((req) => req.id !== id));

  const handleAddLeave = (data) => {
    const newRequest = { ...data, id: Date.now(), status: "Pending" };
    setRequests([...requests, newRequest]);
    setIsModalOpen(false);
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
            {summaryData.map((card) => {
              const Icon = card.icon;

              return (
                <motion.div
                  key={card.id}
                  className="flex-1 min-w-[220px] max-w-[220px] p-6 rounded-xl flex flex-col items-center justify-center shadow-md bg-white"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
                >
                  <p className="text-sm font-semibold text-gray-700 mb-3">{card.label}</p>
                  <div
                    className="p-3 rounded-lg mb-4"
                    style={{ backgroundColor: card.bgColor, color: card.iconColor }}
                  >
                    <Icon className="w-6 h-6" />
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
            })}
          </div>

          {/* Upcoming Holidays Table */}
          <div className="bg-white rounded-xl  border-gray-200 overflow-hidden">
            <h2 className="px-6 py-3 text-sm font-semibold border-b border-gray-200">
              Upcoming Holidays
            </h2>
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full divide-y rounded-xl divide-gray-200">
                <thead className="bg-purple-100 rounded-xl">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {upcomingHolidays.map((holiday, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-xs text-gray-700">{formatHolidayDate(holiday.date)}</td>
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
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Leave Type</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">From</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">To</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((req) => (
                  <motion.tr
                    key={req.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 text-sm text-gray-700">{req.type}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{req.from}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{req.to}</td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[req.status].bg
                          } ${statusStyles[req.status].text}`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {req.status === "Pending" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCancel(req.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded shadow text-xs font-medium hover:bg-red-600"
                        >
                          Cancel
                        </motion.button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      )}
      <AddLeaveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddLeave}
      />
    </div>
  );
}
