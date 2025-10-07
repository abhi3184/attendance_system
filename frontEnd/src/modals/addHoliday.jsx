import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import FancyDropdown from "./dropdowns";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";

export default function AddHolidayModal({ isOpen, onClose, onSave, holiday }) {
  const [formData, setFormData] = useState({
    date: "",
    name: "",
    type: null, // { label, value }
  });
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0];

  const holidayTypes = [
    { label: "National", value: "National" },
    { label: "Festival", value: "Festival" },
  ];

  // Prefill form if holiday exists (edit mode)
  useEffect(() => {
    if (holiday) {
      setFormData({
        date: holiday.date,
        name: holiday.description,
        type: holidayTypes.find((t) => t.value === holiday.type),
      });
    } else if (!isOpen) {
      setFormData({ date: "", name: "", type: null });
      setErrors({});
    }
  }, [isOpen, holiday]);

  const validateField = (name, value) => {
    switch (name) {
      case "date":
        if (!value) return "Please select a date";
        break;
      case "name":
        if (!value) return "Please enter holiday name";
        break;
      case "type":
        if (!value) return "Please select holiday type";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error || undefined }));
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
      const payload = {
        date: formData.date,
        description: formData.name,
        type: formData.type.value,
      };

      let res;
      if (holiday) {
        // Edit → PUT API
        res = await axios.put(`http://127.0.0.1:8000/holidays/update/${holiday.holidays_id}`, payload);
      } else {
        // Add → POST API
        res = await axios.post("http://127.0.0.1:8000/holidays/add_holiday", payload);
      }

      if (res.data.success) {
        toast.success(holiday ? "Holiday updated successfully!" : "Holiday added successfully!");
        if (onSave) onSave();
        onClose();
      } else {
        toast.error(res.data.message || "Operation failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  const inputClass =
    "w-full border rounded-md px-3 pt-4 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={holiday ? "Edit Holiday" : "Add Holiday"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-gray-700 text-sm">
        {/* Date */}
        <div className="relative">
          <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">Date</label>
          <input
            type="date"
            value={formData.date}
            min={today}
            onChange={(e) => handleChange("date", e.target.value)}
            className={`${inputClass} ${errors.date ? "border-red-400" : "border-gray-300"}`}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>

        {/* Name */}
        <div className="relative">
          <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">Holiday Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`${inputClass} ${errors.name ? "border-red-400" : "border-gray-300"}`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Type */}
        <div className="relative">
          <FancyDropdown
            options={holidayTypes}
            value={formData.type?.value}
            onChange={(val) => {
              const selected = holidayTypes.find((t) => t.value === val);
              handleChange("type", selected);
            }}
            placeholder="Select Holiday Type"
            className={`${errors.type ? "border-red-400" : "border-gray-300"} rounded-md`}
          />
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-400 transition"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
          >
            {holiday ? "Update" : "Add"}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
}
