import React, { useState } from "react";
import { motion } from "framer-motion";

const attendanceData = [...Array(100)].map((_, i) => ({
  id: i + 1,
  name: `Employee ${i + 1}`,
  date: `2025-10-${(i % 30) + 1}`,
  checkIn: `09:${(i % 60).toString().padStart(2, "0")} AM`,
  checkOut: `06:${(i % 60).toString().padStart(2, "0")} PM`,
  status: i % 7 === 0 ? "Absent" : "Present",
}));

export default function HrAttendance() {
  const [search, setSearch] = useState("");
  const filtered = attendanceData.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full p-4">      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search employee..."
          className="border rounded-lg text-xs px-4 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y divide-gray-200">
            <thead className="bg-purple-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Check-In</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Check-Out</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Status</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto pb-4">
          <table className="w-full table-auto divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map((emp, idx) => (
                <motion.tr
                  key={emp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.005 }}
                  whileHover={{ backgroundColor: "rgba(243,232,255,0.2)" }}
                >
                  <td className="px-6 py-2 text-xs whitespace-nowrap w-1/4">{emp.name}</td>
                  <td className="px-6 py-2 text-xs whitespace-nowrap w-1/6">{emp.date}</td>
                  <td className="px-6 py-2 text-xs whitespace-nowrap w-1/6">{emp.checkIn}</td>
                  <td className="px-6 py-2 text-xs whitespace-nowrap w-1/6">{emp.checkOut}</td>
                  <td className="px-6 py-2 text-xs whitespace-nowrap w-1/6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${emp.status === "Present"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                        }`}
                    >
                      {emp.status}
                    </span>
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
