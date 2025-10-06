import React, { useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { FaStethoscope } from "react-icons/fa"
import { FaWallet } from "react-icons/fa";
import { motion } from "framer-motion";

export default function LeavePreview({ leaves }) {

  const leaveTypes = {
    "Casual Leave": { icon: FaCalendarAlt, color: "#96bc42", bg: "#96bc4233" },
    "Paid Leave": { icon: FaWallet, color: "#e05654", bg: "#e0565433" },
    "Sick Leave": { icon: FaStethoscope, color: "#ab4afc", bg: "#ab4afc33" },
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {leaves && leaves.map((leave) => {
        const { icon: Icon, color, bg } = leaveTypes[leave.leave_type] || {};
        if (!Icon) return null;

        return (
          <motion.div
            key={leave.leave_type}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="bg-gray-100 shadow-md rounded-lg p-4 flex items-center justify-between w-full cursor-pointer"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg mr-4" style={{ color, backgroundColor: bg }}>
                <Icon size={20} />
              </div>
              <h2 className="text-sm font-semibold">{leave.leave_type}</h2>
            </div>
            <div className="text-right">
              <div className="flex justify-end space-x-6 mb-2">
                {leave.leave_type !== "Leave Without Pay" && <span className="text-gray-500 text-sm">Available</span>}
                <span className="text-gray-500 text-sm">Booked</span>
              </div>
              <div className="flex justify-end space-x-6">
                {leave.leave_type !== "Leave Without Pay" && (
                  <span className="font-semibold text-sm">{leave.remaining_days} days</span>
                )}
                <span className="font-semibold text-sm">{leave.used_days} days</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}