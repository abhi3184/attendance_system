// EmployeeManagement.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { EmployeeModal } from "./AddEmployeeForm";
import { EditEmployeeModal } from "./EditEmployeeFrom";
import { DeleteConfirmModal } from "./EmployeeDelete" // Edit modal (Step 1 only)
import axios from "axios";
import { toast } from "react-toastify";

export default function EmployeeManagement() {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/registration/getAllEmployees");
      if (Array.isArray(res.data?.data)) setEmployees(res.data.data);
      else toast.error("Failed to fetch employees");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const filtered = employees.filter(emp =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSubmit = (data) => {
    toast.success("Employee added successfully!");
    fetchEmployees();
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (data) => {
    toast.success("Employee updated successfully!");
    fetchEmployees();
    setIsEditModalOpen(false);
    setEditingEmployee(null);
  };

  const handleStatusToggle = async (emp) => {
    const newStatus = emp.status === "Active" ? "Inactive" : "Active";

    try {
      // Optimistic UI update
      setEmployees(prev =>
        prev.map(e => e.emp_id === emp.emp_id ? { ...e, status: newStatus } : e)
      );

      // Call API
      await axios.put(`http://127.0.0.1:8000/registration/updateEmployeeStatus`, {
        emp_id: emp.emp_id,
        status: newStatus
      });

      toast.success(`Employee status updated to ${newStatus}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
      // Revert UI if API fails
      setEmployees(prev =>
        prev.map(e => e.emp_code === emp.emp_code ? { ...e, status: emp.status } : e)
      );
    }
  };

  const [deletingEmployee, setDeletingEmployee] = useState(null);

  const handleConfirmDelete = async (emp) => {
    try {
      const res = await axios.delete(`http://127.0.0.1:8000/registration/deleteEmployee`,{
        params: { emp_id: emp.emp_id }
      });
      if (res.status === 200) {
        toast.success(`${emp.firstName} deleted successfully ✅`);
        fetchEmployees(); // Refresh table
        setDeletingEmployee(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete ❌");
    }
  };

  return (
    <div className="flex-1 flex flex-col max-h-full p-4 relative bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search employee..."
          className="border border-gray-300 rounded-lg px-4 py-2 text-xs w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center px-6 py-2 bg-gradient-to-r text-xs from-purple-600 to-purple-800 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          onClick={() => setIsAddModalOpen(true)}
        >
          <FaPlus className="mr-2" /> Add Employee
        </motion.button>
      </div>

      <div className="flex-1 overflow-auto bg-white rounded-xl">
        <table className="w-full table-auto border-collapse border">
          <thead className="bg-purple-100 sticky top-0 z-10">
            <tr>
              {["Emp Code", "Name", "Email", "Mobile", "Department", "Shift Time", "Status", "Actions"].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500 text-sm">
                  Loading employees...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500 text-sm">
                  No employees found
                </td>
              </tr>
            ) : (
              filtered.map((emp, idx) => (
                <motion.tr
                  key={emp.emp_code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.005 }}
                  whileHover={{ backgroundColor: "rgba(107,70,193,0.05)" }}
                >
                  <td className="px-4 py-2 text-xs">{emp.emp_code}</td>
                  <td className="px-4 py-2 text-xs">{`${emp.firstName} ${emp.lastName}`}</td>
                  <td className="px-4 py-2 text-xs">{emp.emailId}</td>
                  <td className="px-4 py-2 text-xs">{emp.mobile}</td>
                  <td className="px-4 py-2 text-xs">{emp.department}</td>
                  <td className="px-4 py-2 text-xs">{emp.shift_time}</td>
                  <td className="px-4 py-2 text-xs">
                    <button
                      onClick={() => handleStatusToggle(emp)}
                      className={`px-3 py-1 rounded-full text-white text-xs font-semibold 
      ${emp.status === "Active" ? "bg-green-400 hover:bg-green-500" : "bg-red-400 hover:bg-red-500"} 
      transition-colors duration-200 w-20 text-center focus:outline-none`}
                    >
                      {emp.status}
                    </button>
                  </td>
                  <td className="px-4 py-2 flex gap-2 justify-end">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded shadow hover:bg-purple-700 transition-all text-xs"
                      onClick={() => {
                        setEditingEmployee(emp);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <FaEdit className="h-3 w-3" /> Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded shadow hover:bg-red-700 transition-all text-xs"
                      onClick={() => setDeletingEmployee(emp)}
                    >
                      <FaTrash className="h-3 w-3" /> Delete
                    </motion.button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal (multi-step) */}
      <EmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />

      {/* Edit Employee Modal (Step 1 only) */}
      {editingEmployee && (
        <EditEmployeeModal
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setEditingEmployee(null); }}
          employeeData={editingEmployee}
          onSubmit={handleEditSubmit}
        />
      )}

      {deletingEmployee && (
        <DeleteConfirmModal
          isOpen={!!deletingEmployee}
          onClose={() => setDeletingEmployee(null)}
          onConfirm={handleConfirmDelete}
          employee={deletingEmployee}
        />
      )}
    </div>
  );
}
