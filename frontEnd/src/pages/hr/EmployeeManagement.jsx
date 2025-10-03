// EmployeeManagement.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaPlus,FaTrash } from "react-icons/fa";
import { EmployeeModal } from "./AddEmployeeForm";
const allEmployees = [...Array(50)].map((_, i) => ({
  id: i + 1,
  name: `Employee ${i + 1}`,
  email: `employee${i + 1}@company.com`,
  role: ["Developer", "Designer", "Tester", "HR"][i % 4],
  department: ["IT", "Design", "QA", "HR"][i % 4],
}));

export default function EmployeeManagement() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = allEmployees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data) => {
    console.log("New Employee Data:", data);
  };

  return (
    <div className="flex-1 flex flex-col h-full p-4 relative">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search employee..."
          className="border rounded-lg px-4 py-2 text-xs w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center px-6 py-2 bg-gradient-to-r text-xs from-purple-600 to-purple-800 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="mr-2" /> Add Employee
        </motion.button>
      </div>
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y divide-gray-200">
            <thead className="bg-purple-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Role</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Department</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Actions</th>
              </tr>
            </thead>
          </table>
        </div>

        <div className="flex-1 overflow-y-auto pb-4">
          <table className="w-full table-auto divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map((emp, idx) => (
                <motion.tr
                  key={emp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.005 }}
                  whileHover={{ backgroundColor: "rgba(107,70,193,0.1)" }}
                  className="cursor-pointer"
                >
                  <td className="px-6 py-2 text-xs whitespace-nowrap w-1/4">{emp.name}</td>
                  <td className="px-6 py-2 text-xs whitespace-nowrap w-1/4">{emp.email}</td>
                  <td className="px-6 py-2 text-xs whitespace-nowrap w-1/6">{emp.role}</td>
                  <td className="px-6 py-2 text-xs whitespace-nowrap w-1/6">{emp.department}</td>
                  <td className="px-6 py-2 text-xs whitespace-nowrap w-1/6 flex gap-2">
                    {/* Edit Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded shadow hover:bg-purple-700 transition-all text-xs"
                    >
                      <FaEdit className="h-3 w-3" />
                      Edit
                    </motion.button>

                    {/* Delete Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded shadow hover:bg-red-700 transition-all text-xs"
                    >
                      <FaTrash className="h-3 w-3" />
                      Delete
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAdd}
      />
    </div>
  );
}
