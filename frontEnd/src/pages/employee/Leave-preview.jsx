import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { FaStethoscope } from "react-icons/fa"
import { FaWallet } from "react-icons/fa";
import { motion } from "framer-motion";

export default function LeavePreview() {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* First Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="bg-gray-100 shadow-md rounded-lg p-4 flex items-center justify-between w-full cursor-pointer"
      >
        <div className="flex items-center">
          <div
            className="p-3 rounded-lg mr-4"
            style={{
              color: "#96bc42",
              backgroundColor: "#96bc4233",
            }}
          >
            <FaCalendarAlt size={20} />
          </div>
          <h2 className="text-sm font-semibold">Earned Leave</h2>
        </div>
        <div className="text-right">
          <div className="flex justify-end space-x-6 mb-2">
            <span className="text-gray-500 text-sm">Available</span>
            <span className="text-gray-500 text-sm">Booked</span>
          </div>
          <div className="flex justify-end space-x-6">
            <span className="font-semibold text-sm">3 days</span>
            <span className="font-semibold text-sm">3 days</span>
          </div>
        </div>
      </motion.div>

      {/* Second Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="bg-gray-100 shadow-md rounded-lg p-4 flex items-center justify-between w-full cursor-pointer"
      >
        <div className="flex items-center">
          <div
            className="p-3 rounded-lg mr-4"
            style={{
              color: "#e05654",
              backgroundColor: "#e0565433",
            }}
          >
            <FaWallet size={20} />
          </div>
          <h2 className="text-sm font-semibold">Leave Without Pay</h2>
        </div>
        <div className="text-right">
          <div className="flex justify-end space-x-6 mb-2">
            <span className="text-gray-500 text-sm">Booked</span>
          </div>
          <div className="flex justify-end space-x-6">
            <span className="font-semibold text-sm">0 days</span>
          </div>
        </div>
      </motion.div>

      {/* Third Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="bg-gray-100 shadow-md rounded-lg p-4 flex items-center justify-between w-full cursor-pointer"
      >
        <div className="flex items-center">
          <div
            className="p-3 rounded-lg mr-4"
            style={{
              color: "#ab4afc",
              backgroundColor: "#ab4afc33",
            }}
          >
            <FaStethoscope size={20} />
          </div>
          <h2 className="text-sm font-semibold">Sick Leave</h2>
        </div>
        <div className="text-right">
          <div className="flex justify-end space-x-6 mb-2">
            <span className="text-gray-500 text-sm">Available</span>
            <span className="text-gray-500 text-sm">Booked</span>
          </div>
          <div className="flex justify-end space-x-6">
            <span className="font-semibold text-sm">3 days</span>
            <span className="font-semibold text-sm">3 days</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}