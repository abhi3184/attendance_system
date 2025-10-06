import React, { useState, useEffect } from "react";
import Modal from "./modal";
import FancyDropdown from "./dropdowns";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import jwt_decode from "jwt-decode";

export default function AddLeaveModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    leaveType: null, // store selected object {label, value}
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0];
  const [leaveTypes, setLeaveTypes] = useState([]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        leaveType: null,
        fromDate: "",
        toDate: "",
        reason: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  // Fetch leave types
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/leave/getAllLeaveTypes");
        if (res.data.success && res.data.data) {
          const options = res.data.data.map((item) => ({
            label: item.leave_name,
            value: item.leave_type_id,
          }));
          setLeaveTypes(options);
        } else {
          toast.error(res.data.message || "Leave types not found!");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch leave types!");
      }
    };
    fetchLeaveTypes();
  }, []);

  // Validation
  const validateField = (name, value) => {
    switch (name) {
      case "leaveType":
        if (!value) return "Please select leave type";
        break;
      case "fromDate":
      case "toDate":
        if (!value) return "This field is required";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    const errorMessage = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMessage || undefined }));
  };

  // Calculate total days
  const calculateTotalDays = () => {
    if (formData.fromDate && formData.toDate) {
      const from = new Date(formData.fromDate);
      const to = new Date(formData.toDate);
      const diffTime = to - from;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const decoded = jwt_decode(token);
      console.log("decoded",decoded )
      const emp_id = decoded.id;

      const payload = {
        emp_id: emp_id,
        leave_type_id: formData.leaveType, // selected leave ID
        start_date: formData.fromDate,
        end_date: formData.toDate,
        reason: formData.reason,
      };

      const res = await axios.post("http://127.0.0.1:8000/leave/addleave", payload);

      if (res.data.success) {
        toast.success("Leave applied successfully!");
        onClose();
        if (onSubmit) onSubmit(); // optional callback
      } else {
        toast.error(res.data.message || "Failed to apply leave!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  const inputBaseClass =
    "w-full border rounded-md px-3 pt-4 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Apply Leave">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-gray-700 text-sm">
        {/* Leave Type */}
        <div className="relative">
          <FancyDropdown
            options={leaveTypes}
            value={formData.leaveType}
            onChange={(val) => handleChange("leaveType", val)}
            placeholder="Select Leave Type"
            className={`${errors.leaveType ? "border-red-400" : "border-gray-300"} rounded-md`}
          />
          {errors.leaveType && <p className="text-red-500 text-xs mt-1">{errors.leaveType}</p>}
        </div>

        {/* From & To Dates */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">From Date</label>
            <input
              type="date"
              value={formData.fromDate}
              min={today}
              onChange={(e) => handleChange("fromDate", e.target.value)}
              className={`${inputBaseClass} ${errors.fromDate ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.fromDate && <p className="text-red-500 text-xs mt-1">{errors.fromDate}</p>}
          </div>

          <div className="flex-1 relative">
            <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">To Date</label>
            <input
              type="date"
              value={formData.toDate}
              min={formData.fromDate || today}
              onChange={(e) => handleChange("toDate", e.target.value)}
              className={`${inputBaseClass} ${errors.toDate ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.toDate && <p className="text-red-500 text-xs mt-1">{errors.toDate}</p>}
          </div>
        </div>

        {/* Total Days */}
        {formData.fromDate && formData.toDate && (
          <p className="text-gray-700 text-sm font-medium">
            Total Days: <span className="font-semibold">{calculateTotalDays()}</span>
          </p>
        )}

        {/* Reason */}
        <div className="relative">
          <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">Reason</label>
          <textarea
            rows={3}
            value={formData.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
            className={`${inputBaseClass} ${errors.reason ? "border-red-400" : "border-gray-300"}`}
          />
          {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-purple-700 transition"
        >
          Send Request
        </motion.button>
      </form>
    </Modal>
  );
}
