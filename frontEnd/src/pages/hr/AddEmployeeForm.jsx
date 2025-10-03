// EmployeeModal.js
import React, { useState } from "react";
import Modal from "../../modals/modal";
import FancyDropdown from "../../modals/dropdowns";

export const EmployeeModal = ({ isOpen, onClose, onSubmit, title = "Add Employee" }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    department: "IT",
    role: "Developer",
    shift: "Morning",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <div className="flex flex-wrap gap-2">
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="flex-1 min-w-0 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="flex-1 min-w-0 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />

        <input
          name="mobile"
          type="tel"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Mobile"
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <div className="flex gap-2">
          <FancyDropdown
            options={["IT", "Design", "QA", "HR"]}
            value={formData.department}
            onChange={(val) => setFormData({ ...formData, department: val })}
          />
          <FancyDropdown
            options={["Developer", "Designer", "Tester", "HR"]}
            value={formData.role}
            onChange={(val) => setFormData({ ...formData, role: val })}
          />
          <FancyDropdown
            options={["Morning", "Evening"]}
            value={formData.shift}
            onChange={(val) => setFormData({ ...formData, shift: val })}
          />
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
          >
            Add
          </button>
        </div>
      </form>
    </Modal>
  );
};
