import React, { useState } from "react";
import { motion } from "framer-motion";

const initialRequests = [
  { id: 1, employee: "Abhijit Deshmukh", type: "Casual Leave", from: "2025-10-05", to: "2025-10-07", status: "Pending" },
  { id: 2, employee: "Rohit Patil", type: "Sick Leave", from: "2025-10-02", to: "2025-10-03", status: "Pending" },
  { id: 3, employee: "Sneha More", type: "Earned Leave", from: "2025-10-10", to: "2025-10-12", status: "Approved" },
  { id: 4, employee: "Ankita Joshi", type: "Casual Leave", from: "2025-10-15", to: "2025-10-16", status: "Rejected" },
  { id: 5, employee: "Kiran Sharma", type: "Sick Leave", from: "2025-10-18", to: "2025-10-19", status: "Pending" },
  { id: 6, employee: "Meera Singh", type: "Casual Leave", from: "2025-10-20", to: "2025-10-21", status: "Approved" },
  { id: 7, employee: "Vikram Desai", type: "Earned Leave", from: "2025-10-22", to: "2025-10-24", status: "Rejected" },
  { id: 8, employee: "Pooja Nair", type: "Casual Leave", from: "2025-10-25", to: "2025-10-26", status: "Pending" },
  { id: 9, employee: "Sahil Mehta", type: "Sick Leave", from: "2025-10-27", to: "2025-10-28", status: "Approved" },
  { id: 10, employee: "Rhea Kapoor", type: "Casual Leave", from: "2025-10-29", to: "2025-10-30", status: "Rejected" },
];

export default function ManagerLeave() {
  const [requests, setRequests] = useState(initialRequests);

  const handleAction = (id, action) => {
    setRequests(prev =>
      prev.map(req => req.id === id ? { ...req, status: action } : req)
    );
  };

  const counts = requests.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    },
    { Pending: 0, Approved: 0, Rejected: 0 }
  );

  const statusStyles = {
    Pending: { bg: "bg-yellow-50", text: "text-yellow-800" },
    Approved: { bg: "bg-green-50", text: "text-green-800" },
    Rejected: { bg: "bg-red-50", text: "text-red-800" },
  };

  return (
    <div className="h-screen flex flex-col p-6 pb-20">
        <h1 className="font-semibold pb-2">Leave Approval</h1>
      {/* Header Cards */}
      <div className="flex flex-wrap gap-4 mb-4">
        {["Pending", "Approved", "Rejected"].map(status => (
          <motion.div
            key={status}
            className={`flex-1 min-w-[160px] p-6 rounded-xl flex flex-col items-center justify-center shadow-lg ${statusStyles[status].bg}`}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
          >
            <p className="text-sm font-semibold text-gray-500">{status}</p>
            <p className={`text-3xl font-bold mt-2 ${statusStyles[status].text}`}>{counts[status]}</p>
          </motion.div>
        ))}
      </div>

      {/* Scrollable Table */}
      <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
        <div className="overflow-y-auto flex-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Employee</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Type</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">From</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">To</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map(req => (
                <motion.tr
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-sm font-medium text-gray-700">{req.employee}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{req.type}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{req.from}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{req.to}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[req.status].bg} ${statusStyles[req.status].text}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    {req.status === "Pending" && (
                      <>    
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAction(req.id, "Approved")}
                          className="px-3 py-1 bg-green-500 text-white rounded shadow text-xs font-medium hover:bg-green-600"
                        >
                          Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAction(req.id, "Rejected")}
                          className="px-3 py-1 bg-red-500 text-white rounded shadow text-xs font-medium hover:bg-red-600"
                        >
                          Reject
                        </motion.button>
                      </>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
