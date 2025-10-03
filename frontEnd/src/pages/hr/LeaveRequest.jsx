import React, { useState } from "react";
import { motion } from "framer-motion";

const leaveRequests = [...Array(50)].map((_, i) => ({
  id: i + 1,
  name: `Employee ${i + 1}`,
  type: ["Casual", "Sick", "Paid"][i % 3],
  from: `2025-10-${(i % 30) + 1}`,
  to: `2025-10-${((i + 2) % 30) + 1}`,
  status: "Pending",
}));

export default function LeaveRequests() {
  const [search, setSearch] = useState("");
  const filtered = leaveRequests.filter(req =>
    req.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = id => alert(`Approved leave for ID ${id}`);
  const handleReject = id => alert(`Rejected leave for ID ${id}`);

  return (
    <div className="flex-1 flex flex-col h-full p-4">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Leave Requests</h1>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search employee..."
          className="border rounded-lg px-4 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">From</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">To</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Actions</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto pb-4">
          <table className="w-full table-auto divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map((req, idx) => (
                <motion.tr
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.005 }}
                  whileHover={{ backgroundColor: "rgba(107,70,193,0.05)" }}
                  className="cursor-pointer"
                >
                  <td className="px-6 py-3 whitespace-nowrap w-1/4">{req.name}</td>
                  <td className="px-6 py-3 whitespace-nowrap w-1/6">{req.type}</td>
                  <td className="px-6 py-3 whitespace-nowrap w-1/6">{req.from}</td>
                  <td className="px-6 py-3 whitespace-nowrap w-1/6">{req.to}</td>
                  <td className="px-6 py-3 whitespace-nowrap w-1/6 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApprove(req.id)}
                      className="px-3 py-1 bg-green-600 text-white font-medium shadow-md hover:bg-green-700 transition-all"
                    >
                      Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReject(req.id)}
                      className="px-3 py-1 bg-red-600 text-white font-medium shadow-md hover:bg-red-700 transition-all"
                    >
                      Reject
                    </motion.button>
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
