import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from "@heroicons/react/24/outline";
import * as jwtDecode from "jwt-decode";
import { roleMap, sidebarTabs } from "../utils/roleMap";

const iconMap = { HomeIcon,CalendarIcon, CalendarDaysIcon, ClockIcon, CheckCircleIcon, ChartBarIcon, UserGroupIcon,CurrencyDollarIcon };

export default function Sidebar({ isOpen, onClose }) {
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode.default(token);
        setUserRole(roleMap[decoded.role]);
      } catch (err) {
      }
    }
  }, []);

  // Filter tabs based on role (exclude report)
  const mainTabs = sidebarTabs.filter(tab => userRole && tab.roles.includes(userRole));

  // Hardcode reports tab at bottom
  const reportTab = {
    key: "report",
    label: "Reports",
    path: "report",
    icon: "ChartBarIcon",
  };

  return (
    <aside className={`fixed md:static top-0 left-0 h-screen w-20 z-10 bg-white border-r shadow-md transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
      <div className="flex flex-col h-full py-3 items-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-4">
          <span className="font-bold text-lg">Logo</span>
        </div>

        {/* Main tabs (top) */}
        <div className="flex flex-col items-center gap-1">
          {mainTabs.map(tab => {
            const Icon = iconMap[tab.icon];
            const isActive = location.pathname.endsWith(tab.path);

            return (
              <button
                key={tab.key + tab.path}
                onClick={() => {
                  navigate(`/dashboard/${tab.path}`);
                  if (onClose) onClose();
                }}
                className="flex flex-col items-center gap-1 w-full py-1.5 transition-all"
              >
                <div className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${isActive ? "bg-purple-600 shadow-md" : "hover:bg-purple-100 hover:shadow"}`}>
                  <Icon className={`h-6 w-6 ${isActive ? "text-white" : "text-gray-500"}`} />
                </div>
                <span className={`text-[10px] ${isActive ? "font-bold text-gray-800" : "font-medium text-gray-500"}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Reports tab (bottom) */}
        <div className="flex flex-col items-center gap-3 mt-auto mb-4">
          <button
            onClick={() => navigate(`/dashboard/${reportTab.path}`)}
            className="flex flex-col items-center gap-1 w-full py-1.5 transition-all"
          >
            <div className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${location.pathname.endsWith(reportTab.path) ? "bg-purple-600 shadow-md" : "hover:bg-purple-100 hover:shadow"}`}>
              <ChartBarIcon className={`h-6 w-6 ${location.pathname.endsWith(reportTab.path) ? "text-white" : "text-gray-500"}`} />
            </div>
            <span className={`text-[10px] ${location.pathname.endsWith(reportTab.path) ? "font-bold text-gray-800" : "font-medium text-gray-500"}`}>
              {reportTab.label}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
