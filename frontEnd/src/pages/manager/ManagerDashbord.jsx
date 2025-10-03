import React from "react";
import { motion } from "framer-motion";
import { FaUserCheck, FaUserTimes, FaClock } from "react-icons/fa";

const ManagerDashboard = () => {
  // Sample data
  const teamLeave = [
    { name: "John Doe", type: "Casual", from: "01-Oct", to: "03-Oct", status: "Pending" },
    { name: "Jane Smith", type: "Sick", from: "02-Oct", to: "02-Oct", status: "Approved" },
  ];

  const teamAttendance = [
    { name: "John Doe", status: "Present", inTime: "10:05 AM", outTime: "07:00 PM", late: "Yes" },
    { name: "Jane Smith", status: "Absent", inTime: "-", outTime: "-", late: "-" },
  ];

  const notifications = [
    "3 pending leave approvals",
    "1 late attendance today",
    "John Doe's birthday tomorrow",
  ];

  return (
    <div className="p-6 space-y-6 ">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div 
          className="bg-blue-500 text-white p-4 rounded shadow flex items-center justify-between"
          whileHover={{ scale: 1.05 }}
        >
          <div>
            <h3 className="text-sm font-medium">Pending Leaves</h3>
            <p className="text-2xl font-bold">3</p>
          </div>
          <FaUserTimes className="text-3xl" />
        </motion.div>

        <motion.div 
          className="bg-green-500 text-white p-4 rounded shadow flex items-center justify-between"
          whileHover={{ scale: 1.05 }}
        >
          <div>
            <h3 className="text-sm font-medium">On Leave Today</h3>
            <p className="text-2xl font-bold">2</p>
          </div>
          <FaUserCheck className="text-3xl" />
        </motion.div>

        <motion.div 
          className="bg-yellow-500 text-white p-4 rounded shadow flex items-center justify-between"
          whileHover={{ scale: 1.05 }}
        >
          <div>
            <h3 className="text-sm font-medium">Team Attendance</h3>
            <p className="text-2xl font-bold">5</p>
          </div>
          <FaClock className="text-3xl" />
        </motion.div>
      </div>

      {/* Team Leave Overview */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Team Leave Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Employee</th>
                <th className="px-4 py-2">Leave Type</th>
                <th className="px-4 py-2">From</th>
                <th className="px-4 py-2">To</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {teamLeave.map((leave, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{leave.name}</td>
                  <td className="px-4 py-2">{leave.type}</td>
                  <td className="px-4 py-2">{leave.from}</td>
                  <td className="px-4 py-2">{leave.to}</td>
                  <td className="px-4 py-2">{leave.status}</td>
                  <td className="px-4 py-2 space-x-2">
                    {leave.status === "Pending" && (
                      <>
                        <button className="px-2 py-1 bg-green-500 text-white rounded text-sm">Approve</button>
                        <button className="px-2 py-1 bg-red-500 text-white rounded text-sm">Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Attendance Summary */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Team Attendance Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Employee</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">In Time</th>
                <th className="px-4 py-2">Out Time</th>
                <th className="px-4 py-2">Late?</th>
              </tr>
            </thead>
            <tbody>
              {teamAttendance.map((att, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{att.name}</td>
                  <td className="px-4 py-2">{att.status}</td>
                  <td className="px-4 py-2">{att.inTime}</td>
                  <td className="px-4 py-2">{att.outTime}</td>
                  <td className="px-4 py-2">{att.late}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts / Notifications */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Alerts / Notifications</h2>
        <ul className="list-disc list-inside space-y-1">
          {notifications.map((note, idx) => (
            <li key={idx} className="text-gray-700">{note}</li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default ManagerDashboard;
