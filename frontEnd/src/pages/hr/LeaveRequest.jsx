import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaTimes, FaPlus } from "react-icons/fa";
import FancyDropdown from "../../modals/dropdowns";
import axios from "axios";

export default function LeaveRequests() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [newLeave, setNewLeave] = useState({ leave_type: "", total_days: "" });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const leaveTypes = ["Sick Leave", "Paid Leave", "Casual Leave"];

  // Fetch leave data from API
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/leave/get_all_leaves");
        setLeaveRequests(res.data);
      } catch (err) {
        console.error("Error fetching leaves:", err);
      }
    };

    fetchLeaves();
  }, []);

  const filtered = leaveRequests.filter(req =>
    `${req.first_name} ${req.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = id => alert(`✅ Approved leave for ID ${id}`);
  const handleReject = id => alert(`❌ Rejected leave for ID ${id}`);

  const handleAddLeave = () => {
    console.log("New Leave Type:", newLeave);
    setModalOpen(false);
    setNewLeave({ leave_type: "", total_days: "" });
    alert(`Added leave type: ${newLeave.leave_type} (${newLeave.total_days} days)`);
  };

  return (
    <div className="flex-1 max-h-full flex flex-col p-4 bg-white rounded-xl shadow-md">
      {/* Search Bar + Add Leave Button */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <input
          type="text"
          placeholder="Search employee..."
          className="border border-gray-300 rounded-lg px-4 py-2 text-xs w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalOpen(true)}
          className="flex items-center px-6 py-2 bg-gradient-to-r text-xs from-purple-600 to-purple-800 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <FaPlus size={12} /> Add Leave
        </motion.button>
      </div>

      {/* Leave Requests Table */}
      <div className="flex-1 flex flex-col bg-white rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y divide-gray-200">
            <thead className="bg-purple-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[25%]">Name</th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">Type</th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">From</th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">To</th>
                <th className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">Actions</th>
              </tr>
            </thead>
          </table>
        </div>

        <div className="flex-1 overflow-y-auto pb-4">
          <table className="w-full table-auto divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((req, idx) => (
                <motion.tr
                  key={req.leave_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.005 }}
                  whileHover={{ backgroundColor: "rgba(243,232,255,0.2)" }}
                  className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} cursor-pointer`}
                >
                  <td className="px-4 py-2 text-xs w-[25%]">{req.first_name} {req.last_name}</td>
                  <td className="px-4 py-2 text-xs w-[15%] text-center">
                    <span
                      className={`inline-flex justify-center items-center text-center
      px-2.5 py-1 rounded-full text-xs font-semibold border w-40
      ${req.leave_type === "Casual Leave" ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : req.leave_type === "Sick Leave" ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-green-100 text-green-700 border-green-200"}`}
                    >
                      {req.leave_type}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs w-[20%] text-center">{req.start_date}</td>
                  <td className="px-4 py-2 text-xs w-[20%] text-center">{req.end_date}</td>
                  <td className="px-4 py-1 text-xs w-[20%] flex gap-2 justify-right">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApprove(req.leave_id)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 transition-all text-[11px] font-medium"
                    >
                      <FaCheck className="h-3 w-3" />
                      Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReject(req.leave_id)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition-all text-[11px] font-medium"
                    >
                      <FaTimes className="h-3 w-3" />
                      Reject
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl p-6 w-96 shadow-lg"
          >
            <h2 className="text-lg font-semibold mb-4">Add Leave Type</h2>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">Leave Type</label>
              <FancyDropdown
                options={leaveTypes}
                value={newLeave.leave_type}
                placeholder="Select Leave Type"
                onChange={val => setNewLeave({ ...newLeave, leave_type: val })}
              />

              <label className="text-sm font-medium">Total Days</label>
              <input
                type="number"
                placeholder="e.g. 12"
                value={newLeave.total_days}
                onChange={e => setNewLeave({ ...newLeave, total_days: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLeave}
                  className="px-3 py-1 text-sm rounded-lg bg-purple-500 text-white hover:bg-purple-600"
                >
                  Add
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
