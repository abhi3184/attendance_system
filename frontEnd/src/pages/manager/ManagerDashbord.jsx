import React from "react";
import { motion } from "framer-motion";
import { FaUserCheck, FaUserTimes, FaClock } from "react-icons/fa";

const ManagerDashboard = () => {
  // Sample data
  const teamLeave = [
    { name: "John Doe", type: "Casual", from: "01-Oct", to: "03-Oct", status: "Pending" },
    { name: "Jane Smith", type: "Sick", from: "02-Oct", to: "02-Oct", status: "Pending" },
    { name: "Jane Smith", type: "Sick", from: "02-Oct", to: "02-Oct", status: "Approved" },
    { name: "Jane Smith", type: "Sick", from: "02-Oct", to: "02-Oct", status: "Approved" },
    { name: "Jane Smith", type: "Sick", from: "02-Oct", to: "02-Oct", status: "Approved" },
    { name: "Jane Smith", type: "Sick", from: "02-Oct", to: "02-Oct", status: "Approved" },
    { name: "Jane Smith", type: "Sick", from: "02-Oct", to: "02-Oct", status: "Approved" },
    { name: "Jane Smith", type: "Sick", from: "02-Oct", to: "02-Oct", status: "Approved" },
  ];

  const teamAttendance = [
    { name: "John Doe", status: "Present", inTime: "10:05 AM", outTime: "07:00 PM", late: "Yes" },
    { name: "John Doe", status: "Present", inTime: "10:05 AM", outTime: "07:00 PM", late: "Yes" },
    { name: "John Doe", status: "Present", inTime: "10:05 AM", outTime: "07:00 PM", late: "Yes" },
    { name: "John Doe", status: "Present", inTime: "10:05 AM", outTime: "07:00 PM", late: "Yes" },
    { name: "John Doe", status: "Present", inTime: "10:05 AM", outTime: "07:00 PM", late: "Yes" },
    { name: "John Doe", status: "Present", inTime: "10:05 AM", outTime: "07:00 PM", late: "Yes" },
    { name: "John Doe", status: "Present", inTime: "10:05 AM", outTime: "07:00 PM", late: "Yes" },
    { name: "John Doe", status: "Present", inTime: "10:05 AM", outTime: "07:00 PM", late: "Yes" },
    { name: "John Doe", status: "Present", inTime: "10:05 AM", outTime: "07:00 PM", late: "Yes" },
    { name: "John Doe", status: "Present", inTime: "10:05 AM", outTime: "07:00 PM", late: "Yes" },
    { name: "John Doe", status: "Present", inTime: "10:05 AM", outTime: "07:00 PM", late: "Yes" },
    { name: "John Doe", status: "Present", inTime: "10:05 AM", outTime: "07:00 PM", late: "Yes" },
    { name: "Jane Smith", status: "Absent", inTime: "-", outTime: "-", late: "-" },
  ];

  const notifications = [
    "3 pending leave approvals",
    "1 late attendance today",
    "John Doe's birthday tomorrow",
  ];

  return (
    <div className="h-screen overflow-auto p-6 pb-20 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 text-white p-4 rounded-xl shadow-lg flex items-center justify-between"
          whileHover={{ scale: 1.05 }}
        >
          <div>
            <h3 className="text-sm font-medium">Pending Leaves</h3>
            <p className="text-2xl font-bold">3</p>
          </div>
          <FaUserTimes className="text-3xl text-blue-700" />
        </motion.div>

        <motion.div
          className="bg-gradient-to-r from-green-400 via-green-300 to-green-200 text-white p-4 rounded-xl shadow-lg flex items-center justify-between"
          whileHover={{ scale: 1.05 }}
        >
          <div>
            <h3 className="text-sm font-medium">On Leave Today</h3>
            <p className="text-2xl font-bold">2</p>
          </div>
          <FaUserCheck className="text-3xl text-green-700" />
        </motion.div>

        <motion.div
          className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 text-white p-4 rounded-xl shadow-lg flex items-center justify-between"
          whileHover={{ scale: 1.05 }}
        >
          <div>
            <h3 className="text-sm font-medium">Team Attendance</h3>
            <p className="text-2xl font-bold">5</p>
          </div>
          <FaClock className="text-3xl text-yellow-700" />
        </motion.div>
      </div>

      {/* Tables Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Team Leave Overview */}
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <h2 className="text-sm font-semibold mb-4">Team Leave Overview</h2>
          <div className="overflow-x-auto h-[300px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 text-blue-800">
                <tr>
                  <th className="px-2 py-2 text-xs">Employee</th>
                  <th className="px-2 py-2 text-xs">Leave Type</th>
                  <th className="px-2 py-2 text-sm">From</th>
                  <th className="px-2 py-2 text-xs">To</th>
                  <th className="px-2 py-2 text-xs">Status</th>
                  <th className="px-2 py-2 text-xs">Action</th>
                </tr>
              </thead>
              <tbody>
                {teamLeave.map((leave, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-2 text-xs">{leave.name}</td>
                    <td className="px-2 py-2 text-xs">{leave.type}</td>
                    <td className="px-2 py-2 text-xs">{leave.from}</td>
                    <td className="px-2 py-2 text-xs">{leave.to}</td>
                    <td className="px-2 py-2 text-xs">{leave.status}</td>
                    <td className="px-2 py-2 space-x-2">
                      {leave.status === "Pending" && (
                        <>
                          <button className="px-2 py-1 text-xs bg-green-400 text-white rounded text-sm hover:bg-green-500 transition">Approve</button>
                          <button className="px-2 py-1 text-xs bg-red-400 text-white rounded text-sm hover:bg-red-500 transition">Reject</button>
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
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <h2 className="text-sm font-semibold mb-4">Team Attendance Summary</h2>
          <div className="overflow-x-auto h-[300px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-gradient-to-r from-green-100 via-green-50 to-green-100 text-green-800">
                <tr>
                  <th className="px-2 py-2 text-xs">Employee</th>
                  <th className="px-2 py-2 text-xs">Status</th>
                  <th className="px-2 py-2 text-xs">In Time</th>
                  <th className="px-2 py-2 text-xs">Out Time</th>
                  <th className="px-2 py-2 text-xs" >Late?</th>
                </tr>
              </thead>
              <tbody>
                {teamAttendance.map((att, idx) => (
                  <tr key={idx} className="border-b hover:bg-green-50 transition-colors">
                    <td className="px-2 py-2 text-xs">{att.name}</td>
                    <td className="px-2 py-2 text-xs">{att.status}</td>
                    <td className="px-2 py-2 text-xs">{att.inTime}</td>
                    <td className="px-2 py-2 text-xs">{att.outTime}</td>
                    <td className="px-2 py-2 text-xs">{att.late}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
