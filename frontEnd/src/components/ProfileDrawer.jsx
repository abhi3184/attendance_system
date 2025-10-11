// ProfileDrawer.js
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import ProfileImage from "../assets/logo/new_color_logo.png";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { clearTokens } from "../api/http/tokenService";
export default function ProfileDrawer({ isOpen, setIsOpen, details }) {
  const handleLogout = () => {
    clearTokens()
    window.location.href = "/login";
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-4 right-4 z-50 w-72 bg-white shadow-lg flex flex-col rounded-xl"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100"
            >
              <XMarkIcon className="h-5 w-5 text-gray-700" />
            </button>

            <div className="flex items-center gap-3 p-4">
              <img
                src={ProfileImage}
                alt="Profile"
                className="h-12 w-14 border border-gray-200 shadow-sm"
              />
              <div>
                <p className="font-semibold text-gray-800 text-sm">{details.firstName} {details.lastName}</p>
                <p className="text-xs text-gray-500">{details.role}</p>
                <p className="text-xs text-gray-500">{details.emailId}</p>
              </div>
            </div>

            <div className="flex justify-between items-center w-full px-4 py-2">
              <button
                className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-100 text-xs font-xs"
              >
                <FaUser />
                My Account
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-100 hover:text-red-700 text-xs font-xs"
              >
                <FaSignOutAlt />
                Logout
              </button>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}