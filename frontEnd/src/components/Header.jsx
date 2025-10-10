// Header.js
import React, { useState } from "react";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import ProfileImage from "../assets/logo/new_color_logo.png";
import ProfileDrawer from "./ProfileDrawer";
import NotificationDrawer from "./notificationDrawer";

export default function Header({ activeTab, onToggleSidebar, isProfileOpen, setProfileOpen }) {
  const employee = JSON.parse(localStorage.getItem("employee"));

  // Notification drawer state
  const [isNotifOpen, setNotifOpen] = useState(false);

  // Example notifications
  const notifications = [
    { id: 1, message: "John applied for leave", time: "2 hours ago" },
    { id: 2, message: "Meeting scheduled at 4 PM", time: "1 day ago" },
    { id: 3, message: "New announcement from HR", time: "3 days ago" },
  ];

  return (
    <>
      <header className="h-14 w-full bg-white flex items-center justify-between px-6 shadow-md z-10">
        {/* Sidebar toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          onClick={onToggleSidebar}
        >
          <Bars3Icon className="h-6 w-6 text-gray-700" />
        </button>

        {/* Employee Name & Role */}
        <h1 className="hidden sm:flex text-sm font-medium flex items-center gap-2 uppercase tracking-wider">
          {employee.firstName} {employee.lastName} -
          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-semibold">
            {employee.role}
          </span>
        </h1>

        {/* Icons */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-purple-50 relative transition-colors"
              onClick={() => setNotifOpen(!isNotifOpen)}
            >
              <BellIcon className="h-6 w-6 text-gray-700" />

              {/* Notification count badge */}
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center py-1 px-2  text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          {/* Profile */}
          <button onClick={() => setProfileOpen(true)}>
            <img
              src={ProfileImage}
              alt="Profile"
              className="h-8 w-8 rounded-full border border-gray-200 shadow-sm hover:ring-2 hover:ring-purple-300 transition-all"
            />
          </button>
        </div>
      </header>

      {/* Drawers */}
      <ProfileDrawer isOpen={isProfileOpen} setIsOpen={setProfileOpen} details={employee} />

      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
      />
    </>
  );
}
