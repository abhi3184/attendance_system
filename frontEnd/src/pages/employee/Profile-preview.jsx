import React from "react";
import { FaMapMarkerAlt, FaUser, FaEnvelope,FaBook ,FaUniversity , FaFlag, FaPhone, FaGraduationCap, FaSchool, FaCalendarAlt } from "react-icons/fa";

export default function ProfilePreview({ employee }) {
  if (!employee) {
    return <p>Loading employee data...</p>;
  }

  // Personal Info
  const personalInfo = [
    { icon: <FaUser size={16} />, label: "Name", value: `${employee.firstName || ''} ${employee.lastName || ''}`, bg: "bg-green-100", iconColor: "text-green-600" },
    { icon: <FaEnvelope size={16} />, label: "Email", value: employee.emailId || '-', bg: "bg-purple-100", iconColor: "text-purple-600" },
    { icon: <FaPhone size={16} />, label: "Mobile", value: employee.mobile || '-', bg: "bg-yellow-100", iconColor: "text-yellow-600" },
  ];

  // Address Info
  const addressInfo = [];
  if (employee.address && typeof employee.address === "object") {
    const addr = employee.address;
    addressInfo.push(
      { icon: <FaMapMarkerAlt size={16} />, label: "Address", value: addr.address || "", bg: "bg-blue-100", iconColor: "text-blue-600" },
      { icon: <FaMapMarkerAlt size={16} />, label: "City", value: addr.city || "", bg: "bg-blue-100", iconColor: "text-blue-600" },
      { icon: <FaFlag size={16} />, label: "State", value: addr.state || "", bg: "bg-blue-100", iconColor: "text-blue-600" },
      { icon: <FaCalendarAlt size={16} />, label: "Zip Code", value: addr.zipCode || "", bg: "bg-blue-100", iconColor: "text-blue-600" },
      { icon: <FaPhone size={16} />, label: "Contact", value: addr.contact || "", bg: "bg-blue-100", iconColor: "text-blue-600" }
    );
  }

  // Education Info
  const educationInfo = [];
  if (employee.education && typeof employee.education === "object") {
    const edu = employee.education;
    educationInfo.push(
      { icon: <FaGraduationCap size={16} />, label: "Degree", value: edu.degree || "", bg: "bg-pink-100", iconColor: "text-pink-600" },
      { icon: <FaSchool size={16} />, label: "College", value: edu.school_name || "", bg: "bg-pink-100", iconColor: "text-pink-600" },
      { icon: <FaCalendarAlt size={16} />, label: "Year", value: edu.passingYear || "", bg: "bg-pink-100", iconColor: "text-pink-600" },
      { icon: <FaBook size={16} />, label: "Field of Study", value: edu.fieldOfStudy || "", bg: "bg-pink-100", iconColor: "text-pink-600" },
      { icon: <FaUniversity size={16} />, label: "University", value: edu.university || "", bg: "bg-pink-100", iconColor: "text-pink-600" }
    );
  }

  const renderCards = (cards) => (
    <div className="w-full p-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="flex items-start bg-white p-4 rounded-lg shadow-sm"
        >
          <div className={`w-9 h-9 flex-shrink-0 flex items-center justify-center ${card.bg} ${card.iconColor} rounded-lg mr-4`}>
            {card.icon}
          </div>
          <div className="flex-1 flex flex-col break-words">
            <div className="text-gray-500 text-xs ">{card.label}</div>
            <div className="text-gray-600 text-xs font-semibold">{card.value}</div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-500 font-semibold mb-2 text-xs">Personal Info</h2>
        {renderCards(personalInfo)}
      </div>
      <div>
        <h2 className="text-gray-500 font-semibold mb-2 text-xs text-xs">Address</h2>
        {addressInfo.length > 0 ? renderCards(addressInfo) : <p>No address data available.</p>}
      </div>
      <div>
        <h2 className="text-gray-500 font-semibold mb-2 text-xs">Education</h2>
        {educationInfo.length > 0 ? renderCards(educationInfo) : <p>No education data available.</p>}
      </div>
    </div>
  );
}
