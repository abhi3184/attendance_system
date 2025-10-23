// ProfileDrawer.js
import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaSignOutAlt, FaCamera } from "react-icons/fa";
import { clearTokens } from "../api/http/tokenService";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { employeeHomeService } from "../api/services/employee/employeeHome";

export default function ProfileDrawer({ isOpen, setIsOpen }) {
  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [showProfileContent, setShowProfileContent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get employee id from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwt_decode(token);
      if (decoded.id) {
        setEmployee({ emp_id: decoded.id });
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Fetch employee details when drawer opens and employee is ready
  useEffect(() => {
    if (isOpen && employee?.emp_id) {
      fetchUserDetails();
    }
  }, [isOpen, employee]);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeHomeService.getEmployeeDetails(employee.emp_id)

      const emp = response.data;
      setFormData({
        firstName: emp.firstName,
        lastName: emp.lastName,
        emailId: emp.emailId,
        phone: emp.mobile,
        department: emp.department,
        shift: emp.shift,
        status: emp.status,
        address: emp.address || {},
        education: emp.education || {},
        experience: emp.experience || [],
      });
      console.log("address", formData.firstName)
      setProfileImage(emp.profileImage || null);

    } catch (err) {
      console.error(err);
      setError("Failed to load profile details");
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = () => {
    clearTokens();
    window.location.href = "/login";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saved data:", formData);
    setEditMode(false);
    // TODO: call API to save changes
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleMyAccountClick = () => {
    setActiveTab("personal");
    setShowProfileContent((prev) => !prev); // toggle visibility
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-4 right-4 z-50 w-80 md:w-96 bg-white shadow-2xl flex flex-col rounded-2xl"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100 z-50"
            >
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            </button>

            {/* Profile Header */}
            <div className="flex flex-col items-center gap-2 p-6 border-b border-gray-200 relative">
              <div className="relative">
                <img
                  src={profileImage || "/default-profile.png"}
                  alt="Profile"
                  className="h-20 w-20 rounded-full border-2 border-gray-300 object-cover shadow-md"
                />
                <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 cursor-pointer hover:bg-blue-600">
                  <FaCamera className="text-white text-sm" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <p className="text-lg font-semibold text-gray-800">
                {formData.firstName} {formData.lastName}
              </p>
              <p className="text-sm text-gray-500">{formData.department}</p>
              <p className="text-sm text-gray-500">{formData.emailId}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center w-full px-6 py-3">
              <button
                onClick={handleMyAccountClick}
                className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-100 text-xs font-semibold"
              >
                <FaUser />
                My Account
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-100 hover:text-red-700 text-xs font-semibold"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>

            {/* Show Profile Tabs on My Account */}
            <AnimatePresence>
              {showProfileContent && (
                <motion.div
                  key="profileContent"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-gray-200"
                >
                  {/* Tabs */}
                  <div className="flex justify-around border-b border-gray-200 mt-2">
                    {["personal", "education", "address", "experience"].map((tab) => (
                      <button
                        key={tab}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === tab
                          ? "border-b-2 border-blue-500 text-blue-500"
                          : "text-gray-500 hover:text-gray-700"
                          }`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 overflow-y-auto max-h-[350px] space-y-4 text-gray-700 text-sm"
                  >
                    {activeTab === "personal" && (
                      <div className="space-y-2">
                        <p><strong>Full Name:</strong> {formData.firstName} {formData.lastName}</p>
                        <p><strong>Email:</strong> {formData.emailId}</p>
                        <p><strong>Phone:</strong> {formData.phone}</p>
                        <p><strong>Department:</strong> {formData.department}</p>
                        <p><strong>Shift:</strong> {formData.shift}</p>
                        <p><strong>Status:</strong> {formData.status}</p>
                      </div>
                    )}
                    {activeTab === "education" && (
                      <div className="space-y-2">
                        <p><strong>School:</strong> {formData.education?.school_name || "-"}</p>
                        <p><strong>Degree:</strong> {formData.education?.degree || "-"}</p>
                        <p><strong>Field:</strong> {formData.education?.fieldOfStudy || "-"}</p>
                        <p><strong>Passing Year:</strong> {formData.education?.passingYear || "-"}</p>
                        <p><strong>University:</strong> {formData.education?.university || "-"}</p>
                        <p><strong>Location:</strong> {formData.education?.location || "-"}</p>
                      </div>
                    )}
                    {activeTab === "address" && (
                      <div className="space-y-2">
                        <p><strong>Street:</strong> {formData.address?.address || "-"}</p>
                        <p><strong>City:</strong> {formData.address?.city || "-"}</p>
                        <p><strong>State:</strong> {formData.address?.state || "-"}</p>
                        <p><strong>ZIP:</strong> {formData.address?.zipCode || "-"}</p>
                        <p><strong>Contact:</strong> {formData.address?.contact || "-"}</p>
                      </div>
                    )}
                    {activeTab === "experience" && (
                      <div className="space-y-2">   
                        {formData.experience?.length ? (
                          formData.experience.map((exp, idx) => (
                            <div key={idx} className="p-2 border rounded space-y-1">
                              <p><strong>Role:</strong> {exp.role}</p>
                              <p><strong>Company:</strong> {exp.company}</p>
                              <p><strong>Years:</strong> {exp.years}</p>
                            </div>
                          ))
                        ) : (
                          <p>No experience info</p>
                        )}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
