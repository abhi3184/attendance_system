// Header.js
import React from "react";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import ProfileImage from "../assets/logo/new_color_logo.png";
import ProfileDrawer from "./ProfileDrawer";

export default function Header({ activeTab, onToggleSidebar, isProfileOpen, setProfileOpen }) {
  const employee = JSON.parse(localStorage.getItem("employee"));
  return (
    <>
      <header className="h-14 w-full bg-white flex items-center justify-between px-6 shadow-md z-10 ">
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={onToggleSidebar}
        >
          <Bars3Icon className="h-6 w-6 text-gray-700" />
        </button>

        <h1 className="text-md font-medium text-gray-800 capitalize">{activeTab}</h1>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-purple-50 relative">
            <BellIcon className="h-6 w-6 text-gray-700" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
          </button>

          <button onClick={() => setProfileOpen(true)}>
            <img
              src={ProfileImage}
              alt="Profile"
              className="h-8 w-8 rounded-full border border-gray-200 shadow-sm hover:ring-2 hover:ring-purple-300"
            />
          </button>
        </div>
      </header>

      <ProfileDrawer isOpen={isProfileOpen} setIsOpen={setProfileOpen} details={employee}/>
    </>
  );
}