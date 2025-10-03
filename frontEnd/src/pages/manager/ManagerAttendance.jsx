import React, { useState } from "react";
import { motion } from "framer-motion";

const allEmployees = [...Array(1000)].map((_, i) => ({
  id: i + 1,
  name: `Employee ${i + 1}`,
  role: ["Developer", "Designer", "Tester", "HR"][i % 4],
  status: ["Present", "Absent", "Late"][Math.floor(Math.random() * 3)],
  checkIn: "09:00 AM",
  checkOut: "06:00 PM",
}));

const statusColors = {
  Present: "bg-green-100 text-green-800",
  Absent: "bg-red-100 text-red-800",
  Late: "bg-yellow-100 text-yellow-800",
};

export default function ManagerAttendance() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;

  const filtered = allEmployees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Team Attendance</h1>

      {/* Search */}
      <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search employee..."
          className="border rounded px-3 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="text-gray-700">
          Showing {paginated.length} of {filtered.length} results
        </div>
      </div>

      {/* Table wrapper */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col flex-1">
        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Check-In
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Check-Out
                </th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Scrollable Table Body */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full table-auto divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {paginated.map((emp, idx) => (
                <motion.tr
                  key={emp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.01 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-2 whitespace-nowrap w-1/4">{emp.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap w-1/6">{emp.role}</td>
                  <td className="px-4 py-2 whitespace-nowrap w-1/6">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${statusColors[emp.status]}`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap w-1/6">{emp.checkIn}</td>
                  <td className="px-4 py-2 whitespace-nowrap w-1/6">{emp.checkOut}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-end gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1 text-gray-700">
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
