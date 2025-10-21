import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes, FaPlus, FaSearch } from "react-icons/fa";
import FancyDropdown from "../../components/dropdowns";
import ConfirmStatusModal from "../../modals/leaveStatusChange";
import { toast } from "react-toastify";
import { hrleaveService } from "../../api/services/hrDashboard/HrleaveService";

export default function LeaveRequests() {
  const [activeTab, setActiveTab] = useState("requests");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [leavePolicy, setLeavePolicy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [addLeaveModal, setAddLeaveModal] = useState(false);
  const [newLeave, setNewLeave] = useState({ leave_type: "", total_days: "" });
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null, action: "" });
  const [errors, setErrors] = useState({});

  // ------------------ Load Leave Requests ------------------
  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      if (ignore) return;
      await loadLeaveRequests();
      await loadLeavePolicy();
    };
    fetchData();
    return () => {
      ignore = true;
    };
  }, []);

  const loadLeaveRequests = async () => {
    setLoading(true);
    try {
      const res = await hrleaveService.getAllLeaves();
      const mappedLeaves = res.data.map((l) => ({
        ...l,
        status:
          l.hr_status === "Approved"
            ? "Approved"
            : l.hr_status === "Rejected"
            ? "Rejected"
            : "Pending",
      }));
      setLeaveRequests(mappedLeaves);
      setFiltered(mappedLeaves);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Load Leave Policy ------------------
  const loadLeavePolicy = async () => {
    try {
      const res = await hrleaveService.getAllLeaveTypes();
      if (res.success) {
        setLeavePolicy(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load leave policy");
    }
  };

  // ------------------ Add / Update Leave ------------------
  const handleAddLeave = async () => {
  let validationErrors = {};
  if (!newLeave.leave_type.trim()) validationErrors.leave_type = "Please enter leave type.";
  if (!newLeave.total_days || newLeave.total_days <= 0) validationErrors.total_days = "Please enter valid total days.";

  setErrors(validationErrors);
  if (Object.keys(validationErrors).length > 0) return;

  try {
    // Call API to add/update leave
    const payload = {
      leave_name: newLeave.leave_type,
      total_days: Number(newLeave.total_days),
    };

    const res = await hrleaveService.addLeaveBalance(payload)
    console.log("REs",res)
    if (res) {
      toast.success(`${newLeave.leave_type} saved successfully!`);
      setNewLeave({ leave_type: "", total_days: "" });
      setAddLeaveModal(false);
      // Reload leave policy from server
      await loadLeavePolicy();
    } else {
      toast.error(res.message || "Failed to add leave");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong!");
  }
};


  // ------------------ Approve / Reject Leave ------------------
  const handleApprove = async (id) => {
    try {
      const payload = { leave_id: id, status: "Approved" };
      const res = await hrleaveService.updateLeaveStatus(payload);
      if (res.success) {
        toast.success("Leave approved successfully!");
        loadLeaveRequests();
      } else toast.error(res.message || "Failed to approve leave");
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const handleReject = async (id) => {
    try {
      const payload = { leave_id: id, status: "Rejected" };
      const res = await hrleaveService.updateLeaveStatus(payload);
      if (res.success) {
        toast.success("Leave rejected successfully!");
        loadLeaveRequests();
      } else toast.error(res.message || "Failed to reject leave");
    } catch {
      toast.error("Something went wrong!");
    }
  };

  // ------------------ Search & Filter ------------------
  useEffect(() => {
    let data = [...leaveRequests];
    if (searchTerm) {
      const terms = searchTerm.toLowerCase().split(" ").filter(Boolean);
      data = data.filter((x) =>
        terms.every((term) =>
          [x.firstName, x.lastName, x.department]
            .map((f) => (f || "").toLowerCase())
            .some((field) => field.includes(term))
        )
      );
    }
    if (statusFilter !== "All") data = data.filter((x) => x.status === statusFilter);
    setFiltered(data);
  }, [searchTerm, statusFilter, leaveRequests]);

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);
  const openConfirmModal = (id, action) => setConfirmModal({ open: true, id, action });
  const handleConfirm = async () => {
    if (!confirmModal.id) return;
    if (confirmModal.action === "Approved") await handleApprove(confirmModal.id);
    if (confirmModal.action === "Rejected") await handleReject(confirmModal.id);
    setConfirmModal({ open: false, id: null, action: "" });
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b pb-2">
        {["requests", "policy"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-semibold transition-all text-sm ${
              activeTab === tab
                ? "text-purple-700 border-b-2 border-purple-700"
                : "text-gray-500 hover:text-purple-600"
            }`}
          >
            {tab === "requests" ? "Leave Requests" : "Leave Policy"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* -------------------- Leave Requests -------------------- */}
        {activeTab === "requests" ? (
          <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {/* Search + Filter */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative w-80">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or department..."
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-auto min-w-[140px]">
                <FancyDropdown options={["All", "Pending", "Approved", "Rejected"]} value={statusFilter} onChange={setStatusFilter} />
              </div>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-purple-50 rounded-xl border border-purple-100"></div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center text-gray-500 py-10">No leave requests found.</div>
            ) : (
              filtered.map((req) => (
                <motion.div
                  key={req.leave_id}
                  layout
                  onClick={() => toggleExpand(req.leave_id)}
                  className={`bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-sm p-4 border-l-4 cursor-pointer transition-all ${
                    req.status === "Approved" ? "border-green-400" : req.status === "Rejected" ? "border-red-400" : "border-yellow-400"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-base font-semibold text-gray-800 flex items-center gap-2">
                        {req.firstName} {req.lastName}
                        <motion.span animate={{ rotate: expandedId === req.leave_id ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-gray-500 text-xs">
                          ▼
                        </motion.span>
                      </p>
                      <p className="text-xs text-gray-600">
                        {req.department || "IT"} • {req.leave_name} • {req.used_days || 0} days
                      </p>
                      <p className="text-xs text-gray-600">
                        🟣 Available Leaves:{" "}
                        <span className="font-semibold text-purple-700">{req.total_days - (req.used_days || 0)} days</span>
                      </p>
                      <p className="text-xs mt-1 font-medium text-orange-900 bg-orange-200 px-2 rounded">
                        {new Date(req.start_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} →{" "}
                        {new Date(req.end_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {req.status === "Pending" ? (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); openConfirmModal(req.leave_id, "Approved"); }} className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full">
                            <FaCheck size={12} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); openConfirmModal(req.leave_id, "Rejected"); }} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full">
                            <FaTimes size={12} />
                          </button>
                        </>
                      ) : (
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${req.status === "Approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === req.leave_id && (
                      <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 pl-2 border-l-2 border-purple-200 text-xs text-gray-600 space-y-1 bg-purple-50 rounded-md p-2">
                        <p>Reason: {req.reason || "Not specified"}</p>
                        <p>
                          Duration:{" "}
                          {Math.ceil((new Date(req.end_date) - new Date(req.start_date)) / (1000 * 60 * 60 * 24)) + 1} days
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          // -------------------- Leave Policy --------------------
          <motion.div key="policy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAddLeaveModal(true)}
              className="fixed bottom-10 right-10 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg"
            >
              <FaPlus size={14} />
            </motion.button>

            <div className="overflow-x-auto bg-white shadow-sm rounded-xl border border-purple-100">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold">Leave Type</th>
                    <th className="py-3 px-4 text-center font-semibold">Total Days</th>
                  </tr>
                </thead>
                <tbody>
                  {leavePolicy.map((type, i) => (
                    <tr key={i} className="border-b hover:bg-purple-50 transition-all">
                      <td className="py-3 px-4">{type.leave_name}</td>
                      <td className="py-3 px-4 text-center">{type.total_days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------- Add Leave Modal (Always Render) -------------------- */}
      {addLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-xl p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add Leave Type</h2>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">Leave Type</label>
              <input
                type="text"
                placeholder="e.g. Sick, Paid, Casual..."
                value={newLeave.leave_type}
                onChange={(e) => {
                  setNewLeave({ ...newLeave, leave_type: e.target.value });
                  setErrors((prev) => ({ ...prev, leave_type: "" }));
                }}
                className={`border ${errors.leave_type ? "border-red-400" : "border-gray-300"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              {errors.leave_type && <span className="text-xs text-red-500">{errors.leave_type}</span>}

              <label className="text-sm font-medium">Total Days</label>
              <input
                type="number"
                placeholder="e.g. 12"
                value={newLeave.total_days}
                onChange={(e) => {
                  setNewLeave({ ...newLeave, total_days: e.target.value });
                  setErrors((prev) => ({ ...prev, total_days: "" }));
                }}
                className={`border ${errors.total_days ? "border-red-400" : "border-gray-300"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              {errors.total_days && <span className="text-xs text-red-500">{errors.total_days}</span>}

              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setAddLeaveModal(false)} className="px-3 py-1 text-sm rounded-lg border border-gray-300 hover:bg-gray-100">
                  Cancel
                </button>
                <button onClick={handleAddLeave} className="px-3 py-1 text-sm rounded-lg bg-purple-500 text-white hover:bg-purple-600">
                  Add
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* -------------------- Confirm Modal -------------------- */}
      <ConfirmStatusModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, id: null, action: "" })}
        onConfirm={handleConfirm}
        status={confirmModal.action}
      />
    </div>
  );
}
