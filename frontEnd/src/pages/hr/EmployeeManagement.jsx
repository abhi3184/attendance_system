import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaPlus } from "react-icons/fa";

const allEmployees = [...Array(50)].map((_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    email: `employee${i + 1}@company.com`,
    role: ["Developer", "Designer", "Tester", "HR"][i % 4],
    department: ["IT", "Design", "QA", "HR"][i % 4],
}));

export default function EmployeeManagement() {
    const [search, setSearch] = useState("");

    const filtered = allEmployees.filter(emp =>
        emp.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex-1 flex flex-col h-full p-4">
            {/* Header + Add Employee */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                    <motion.span
                        whileHover={{ rotate: 45 }}
                        className="mr-2 flex items-center"
                    >
                        <FaPlus />
                    </motion.span>
                    Add Employee
                </motion.button>
            </div>

            {/* Search Bar */}
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
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Actions</th>
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
                                    whileHover={{ backgroundColor: "rgba(107,70,193,0.1)" }} // subtle dark lavender hover
                                    className="cursor-pointer"
                                >
                                    <td className="px-6 py-3 whitespace-nowrap w-1/4">{emp.name}</td>
                                    <td className="px-6 py-3 whitespace-nowrap w-1/4">{emp.email}</td>
                                    <td className="px-6 py-3 whitespace-nowrap w-1/6">{emp.role}</td>
                                    <td className="px-6 py-3 whitespace-nowrap w-1/6">{emp.department}</td>
                                    <td className="px-6 py-3 whitespace-nowrap w-1/6">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center px-3 py-1 bg-purple-700 text-white font-medium shadow-md hover:bg-purple-800 transition-all"
                                        >
                                            <FaEdit className="mr-1" /> Edit
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
