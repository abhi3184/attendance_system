import React from "react";
import { FaMapMarkerAlt, FaUser, FaEnvelope } from "react-icons/fa";

export default function ProfileTab() {
  const profileCards = [
    { icon: <FaMapMarkerAlt size={20} />, label: "Location", value: "Mumbai", bg: "bg-blue-100", iconColor: "text-blue-600" },
    { icon: <FaUser size={20} />, label: "Name", value: "Abhijit Deshmukh", bg: "bg-green-100", iconColor: "text-green-600" },
    { icon: <FaEnvelope size={20} />, label: "Email", value: "abhijit@example.com", bg: "bg-purple-100", iconColor: "text-purple-600" },
  ];

  return (
    <div className="w-full p-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {profileCards.map((card, index) => (
        <div key={index} className="flex items-center bg-white p-4 rounded-lg ">
          {/* Icon on the left */}
          <div className={`w-12 h-12 flex items-center justify-center ${card.bg} ${card.iconColor} rounded-lg mr-4`}>
            {card.icon}
          </div>

          {/* Text on the right */}
          <div className="flex flex-col">
            <div className="text-gray-500 text-sm">{card.label}</div>
            <div className="text-gray-600 text-sm font-semibold">{card.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
