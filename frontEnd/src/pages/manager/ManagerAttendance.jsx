import React, { useState } from "react";
import { motion } from "framer-motion";

const allEmployees = [...Array(20)].map((_, i) => ({
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
    <div className="flex-1 flex flex-col max-h-full p-4 relative bg-white rounded-xl shadow-md">
      {/* Search */}
      <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search employee..."
          className="border border-gray-300 rounded-lg px-4 py-2 text-xs w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🗂 Employee Table */}
      <div className="overflow-auto rounded-2xl ">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-purple-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check In</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check Out</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(emp => (
              <tr
                key={emp.emp_id}
                className="hover:bg-purple-50 cursor-pointer transition"
                onClick={() => setSelectedEmployee(emp)}
              >
                <td className="px-4 py-2 text-xs">{emp.name}</td>
                <td className="px-4 py-2 text-xs">{emp.role}</td>
                <td className="px-4 py-2 text-xs">


                  <span
                    className={`px-2 py-1 w-20 rounded text-xs font-medium ${statusColors[emp.status]}`}
                  >
                    {emp.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-xs">{emp.checkIn}</td>
                <td className="px-4 py-2 text-xs">{emp.checkIn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
