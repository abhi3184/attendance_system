import React from "react";
import { motion } from "framer-motion";
import { FaDownload, FaEye } from "react-icons/fa";

const payrollData = [...Array(50)].map((_, i) => ({
  id: i + 1,
  name: `Employee ${i + 1}`,
  department: ["IT","Design","QA","HR"][i%4],
  salary: `$${3000 + i*10}`,
  bonus: `$${100 + i*5}`,
  total: `$${3100 + i*15}`
}));

export default function PayrollManage() {
  return (
    <div className="flex-1 flex flex-col h-full p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Payroll</h1>

      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Department</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Salary</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Bonus</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Total</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Actions</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto pb-4">
          <table className="w-full table-auto divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-100">
              {payrollData.map((emp, idx) => (
                <motion.tr
                  key={emp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.005 }}
                  whileHover={{ backgroundColor: "rgba(243,232,255,0.2)" }}
                >
                  <td className="px-6 py-3 whitespace-nowrap w-1/4">{emp.name}</td>
                  <td className="px-6 py-3 whitespace-nowrap w-1/6">{emp.department}</td>
                  <td className="px-6 py-3 whitespace-nowrap w-1/6">{emp.salary}</td>
                  <td className="px-6 py-3 whitespace-nowrap w-1/6">{emp.bonus}</td>
                  <td className="px-6 py-3 whitespace-nowrap w-1/6">{emp.total}</td>
                  <td className="px-6 py-3 whitespace-nowrap w-1/6 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 bg-purple-700 text-white font-medium shadow-md hover:bg-purple-800 transition-all flex items-center"
                    >
                      <FaEye className="mr-1"/> View
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 bg-purple-700 text-white font-medium shadow-md hover:bg-purple-800 transition-all flex items-center"
                    >
                      <FaDownload className="mr-1"/> Download
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
