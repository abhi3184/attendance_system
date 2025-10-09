import React from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

export default function TotalTeamModal({ isOpen, onClose, teamMembers }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <motion.div
        className="bg-white rounded-2xl p-6 w-11/12 max-w-3xl max-h-[80vh] overflow-y-auto shadow-lg relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        {/* Top-right cross icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          <IoClose />
        </button>

        <h2 className="text-lg font-semibold mb-4">Team Members</h2>

        {teamMembers.length === 0 ? (
          <p className="text-gray-500">No team members found.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-purple-100 sticky top-0 z-10">
                <tr>
                  {["Emp Code", "Name",  "Mobile", "Department", "Shift Time", "Status"].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map((emp, idx) => (
                  <motion.tr
                    key={emp.emp_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.01 }}
                    whileHover={{ backgroundColor: "rgba(107,70,193,0.05)" }}
                  >
                    <td className="px-4 py-2 text-xs">{emp.emp_code}</td>
                    <td className="px-4 py-2 text-xs">{`${emp.firstName} ${emp.lastName}`}</td>
                    <td className="px-4 py-2 text-xs">{emp.mobile || "N/A"}</td>
                    <td className="px-4 py-2 text-xs">{emp.department || "N/A"}</td>
                    <td className="px-4 py-2 text-xs">{emp.shift_time || "N/A"}</td>
                    <td className="px-4 py-2 text-xs">
                      <span
                        className={`px-3 py-1 rounded  text-xs font-semibold 
                        ${emp.status === "Active" ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"}`}
                      >
                        {emp.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom-right Close button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-purple-500 text-white px-4 py-1 text-sm rounded-lg hover:bg-purple-600"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
