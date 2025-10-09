import React from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaCalendarAlt, FaUser, FaClock, FaInfoCircle, FaBriefcase } from "react-icons/fa";

export default function LeaveDetailsModal({ isOpen, onClose, leaves }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <motion.div
                className="bg-white rounded-2xl p-6 w-11/12 max-w-3xl max-h-[80vh] overflow-y-auto shadow-lg relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
            >
                {/* Top-right cross */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
                >
                    <IoClose />
                </button>

                <h2 className="text-lg font-semibold mb-4 flex  gap-2"> Employees on Leave</h2>

                {leaves && leaves.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl">
                        <table className="w-full table-auto border-collapse">
                            <thead className="bg-purple-100 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">From Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">To Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Days</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Leave Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.map((leave, index) => (
                                    <tr
                                        key={index}
                                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                    >
                                        <td className="px-4 py-2 text-xs">{leave.first_name} {leave.last_name}</td>
                                        <td className="px-4 py-2 text-xs">{leave.start_date}</td>
                                        <td className="px-4 py-2 text-xs">{leave.end_date}</td>
                                        <td className="px-4 py-2 text-xs text-orange-600 font-bold">  {(() => {
                                            const start = new Date(leave.start_date);
                                            const end = new Date(leave.end_date);
                                            const diffTime = Math.abs(end - start);
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                                            return diffDays;
                                        })()}</td>
                                        <td className="px-4 py-2 text-xs">
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded ${leave.status === "Approved" ? "text-green-600 bg-green-100" :
                                                    leave.status === "Pending" ? "text-yellow-600 bg-yellow-100" :
                                                        "text-red-600 bg-red-100"
                                                    }`}>
                                                {leave.status}
                                            </span>

                                        </td>
                                        <td className="px-4 py-2 text-xs">{leave.reason || "N/A"}</td>
                                        <td className="px-4 py-2 text-xs">{leave.leave_type || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500">No leave records found.</p>
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
