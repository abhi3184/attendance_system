import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { FaUsers, FaUserCheck, FaUserTimes, FaClipboardList, FaCalendarAlt, FaSun } from "react-icons/fa";

// Sample Employees Data
const initialEmployees = [
  { emp_id: 1, first_name: "John", last_name: "Doe", department: "IT", salary: 55000, status: "Present", email: "john@example.com", phone: "1234567890" },
  { emp_id: 2, first_name: "Jane", last_name: "Smith", department: "HR", salary: 48000, status: "Absent", email: "jane@example.com", phone: "9876543210" },
  { emp_id: 3, first_name: "Mark", last_name: "Taylor", department: "Finance", salary: 60000, status: "Present", email: "mark@example.com", phone: "1122334455" },
  { emp_id: 3, first_name: "Mark", last_name: "Taylor", department: "Finance", salary: 60000, status: "Present", email: "mark@example.com", phone: "1122334455" },

];

export default function TeamDetailsTable() {
  const [employees, setTeamMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [manager, setManager] = useState(null);


  const filteredEmployees = employees.filter(emp =>
    `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwt_decode(token);
      if (decoded.id !== undefined) {
        setManager({ emp_id: decoded.id, manager_id: decoded.manager_id || null });
      } else toast.error("Invalid token structure!");
    } catch (err) {
      console.error("Invalid token", err);
      toast.error("Invalid token!");
    }
  }, []);


  useEffect(() => {
    if (!manager?.emp_id) return;
    axios.get(`http://127.0.0.1:8000/registration/get_employee_by_manager/${manager.emp_id}`)
      .then(res => res.data.success && setTeamMembers(res.data.data))
      .catch(err => console.error(err));
  }, [manager]);

  return (
    <motion.div className="flex-1 flex flex-col max-h-full p-4 relative bg-white rounded-xl shadow-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* 🔍 Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search employee..."
          className="border border-gray-300 rounded-lg px-4 py-2 text-xs w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 🗂 Employee Table */}
      <div className="overflow-auto rounded-2xl ">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-purple-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Emp Code</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Shift</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Salary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredEmployees.map(emp => (
              <tr
                key={emp.emp_id}
                className="hover:bg-purple-50 cursor-pointer transition"
                onClick={() => setSelectedEmployee(emp)}
              >
                <td className="px-4 py-2 text-xs">{emp.emp_code}</td>

                <td className="px-4 py-2 text-xs">{emp.firstName} {emp.lastName}</td>
                <td className="px-4 py-2 text-xs">{emp.emailId}</td>
                <td className="px-4 py-2 text-xs">{emp.mobile}</td>
                <td className="px-4 py-2 text-xs">{emp.department}</td>
                <td className="px-4 py-2 text-xs flex items-center gap-1">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    >
                      <FaSun className="text-yellow-500" />
                    </motion.div>
                    <span>{emp.shift_time}</span>

                </td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${emp.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="px-4 py-2text-xs"><span className="text-gray-700">₹</span> {emp.salary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-xl w-80 relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedEmployee(null)}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold text-gray-700 mb-3">{selectedEmployee.first_name} {selectedEmployee.last_name}</h2>
            <p><span className="font-semibold">Department:</span> {selectedEmployee.department}</p>
            <p><span className="font-semibold">Salary:</span> ₹{selectedEmployee.salary}</p>
            <p><span className="font-semibold">Status:</span> {selectedEmployee.status}</p>
            <p><span className="font-semibold">Email:</span> {selectedEmployee.email}</p>
            <p><span className="font-semibold">Phone:</span> {selectedEmployee.phone}</p>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}
