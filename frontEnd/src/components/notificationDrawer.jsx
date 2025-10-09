import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaRegCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function NotificationPopover({ isOpen, onClose, notifications }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Popover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute right-2 mt-2 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-purple-600 text-white rounded-t-2xl">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FaBell /> Notifications
              </h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Notification list */}
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-6 text-center text-gray-500">No notifications</p>
              ) : (
                notifications.map((notif, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-6 py-4 border-b hover:bg-purple-50 transition cursor-pointer"
                  >
                    {/* Icon based on type */}
                    <div>
                      {notif.type === "success" ? (
                        <FaRegCheckCircle className="text-green-500 text-xl" />
                      ) : (
                        <FaExclamationCircle className="text-red-500 text-xl" />
                      )}
                    </div>

                    {/* Message */}
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{notif.message}</p>
                      <span className="text-xs text-gray-400">{notif.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Close */}
            <div className="flex justify-end p-4 bg-gray-50">
              <button
                onClick={onClose}
                className="bg-purple-600 text-white px-4 py-2 text-xs rounded-lg hover:bg-purple-700 font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
