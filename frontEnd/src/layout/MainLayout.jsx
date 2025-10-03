// Layout.js
import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header
          activeTab="Dashboard"
          onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          isProfileOpen={isProfileOpen}
          setProfileOpen={setProfileOpen}
        />

        {/* Overlay when drawer open */}
        {isProfileOpen && (
          <div className="fixed inset-0 bg-black/20 z-30"></div>
        )}

        <main className={`flex-1 overflow-hidden p-4 relative z-10`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}