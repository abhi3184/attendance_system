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

      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y divide-gray-200">
            <thead className="bg-purple-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">Name</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">Department</th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[12%]">Salary</th>
                <th className="px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[12%]">Bonus</th>
                <th className="px-1 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[12%]">Total</th>
                <th className="px-1 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[24%]">Actions</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Body */}
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
                  <td className="px-4 py-2 text-xs whitespace-nowrap w-[20%]">{emp.name}</td>
                  <td className="px-4 py-2 text-xs whitespace-nowrap w-[20%]">{emp.department}</td>
                  <td className="px-4 py-2 text-xs whitespace-nowrap w-[12%]">{emp.salary}</td>
                  <td className="px-4 py-2 text-xs whitespace-nowrap w-[12%]">{emp.bonus}</td>
                  <td className="px-4 py-2 text-xs whitespace-nowrap w-[12%]">{emp.total}</td>
                  <td className="px-4 py-2 text-xs whitespace-nowrap w-[24%] flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded shadow hover:bg-purple-700 transition-all text-[11px]"
                    >
                      <FaEye className="h-3 w-3" /> View
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded shadow hover:bg-purple-700 transition-all text-[11px]"
                    >
                      <FaDownload className="h-3 w-3" /> Download
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
