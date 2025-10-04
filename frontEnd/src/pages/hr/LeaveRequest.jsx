// LeaveRequests.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";

const leaveRequests = [...Array(5)].map((_, i) => ({
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

  const handleApprove = id => alert(`✅ Approved leave for ID ${id}`);
  const handleReject = id => alert(`❌ Rejected leave for ID ${id}`);

  return (
    <div className="flex-1 max-h-full flex flex-col p-4 bg-white rounded-xl shadow-md">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search employee..."
          className="border border-gray-300 rounded-lg px-4 py-2 text-xs w-full sm:w-1/3 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Leave Requests Table */}
      <div className="flex-1 flex flex-col bg-white rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y divide-gray-200">
            <thead className="bg-purple-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[25%]">
                  Name
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">
                  Type
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">
                  From
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">
                  To
                </th>
                <th className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">
                  Actions
                </th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto pb-4">
          <table className="w-full table-auto divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((req, idx) => (
                <motion.tr
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.005 }}
                  whileHover={{ backgroundColor: "rgba(243,232,255,0.2)" }}
                  className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} cursor-pointer`}
                >
                  {/* Name */}
                  <td className="px-4 py-2 text-xs w-[25%]">{req.name}</td>

                  {/* Type */}
                  <td className="px-4 py-2 text-xs w-[15%] text-center">
                    <span
                      className={`inline-flex justify-center items-center text-center
      px-2.5 py-1 rounded-full text-xs font-semibold border w-20
      ${req.type === "Casual"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : req.type === "Sick"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-green-100 text-green-700 border-green-200"
                        }`}
                    >
                      {req.type}
                    </span>
                  </td>

                  {/* From */}
                  <td className="px-4 py-2 text-xs w-[20%] text-center">{req.from}</td>

                  {/* To */}
                  <td className="px-4 py-2 text-xs w-[20%] text-center">{req.to}</td>

                  {/* Actions */}
                  <td className="px-4 py-1 text-xs w-[20%] flex gap-2 justify-right">
                    {/* Approve */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApprove(req.id)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-green-500 text-white rounded-md shadow-sm 
                                 hover:bg-green-600 transition-all text-[11px] font-medium"
                    >
                      <FaCheck className="h-3 w-3" />
                      Approve
                    </motion.button>

                    {/* Reject */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReject(req.id)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white rounded-md shadow-sm 
                                 hover:bg-red-600 transition-all text-[11px] font-medium"
                    >
                      <FaTimes className="h-3 w-3" />
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
