import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaWallet, FaStethoscope, FaPlus } from "react-icons/fa";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
import AddLeaveModal from "../../modals/addLeaveModal";
import ConfirmStatusModal from "../../modals/leaveStatusChange";
import { EmployeeOverViewService } from "../../api/services/manager/employeeOverViewService";
import { employeeHomeService } from "../../api/services/employee/employeeHome";

// ---------------------- Status Styles ----------------------
const statusStyles = {
  Pending: { bg: "bg-yellow-50", text: "text-yellow-800" },
  Approved: { bg: "bg-green-50", text: "text-green-800" },
  Rejected: { bg: "bg-red-50", text: "text-red-800" },
};

// ---------------------- Map DB Status to UI Status ----------------------
const uiStatusMapping = {
  Pending: "Pending",
  Approved: "Approved",
  Rejected: "Rejected",
};

// ---------------------- Format Holiday Date ----------------------
const formatHolidayDate = (dateString) => {
  const date = new Date(dateString);
  const weekdays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const year = date.getFullYear();
  const weekday = weekdays[date.getDay()];
  return `${day}-${month}-${year} , ${weekday}`;
};

export default function ManagerLeave() {
  const loggedInUserDetails = JSON.parse(localStorage.getItem("employee"));
  const [activeTab, setActiveTab] = useState("summary");
  const [requests, setRequests] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [employee, setEmployeeData] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, leaveId: null, action: "" });
  const icons = [FaCalendarAlt, FaWallet, FaStethoscope];
  const [teamLeaveFilter, setTeamLeaveFilter] = useState("Pending");

  // ---------------------- FETCH DATA ----------------------
  const fetchLeaveSummary = async (empId) => {
    try {
      setLoading(true);
      const response = await EmployeeOverViewService.leaveSummary(empId);
      if (response) {
        const colors = [
          { bgColor: "rgba(236, 253, 245, 1)", iconColor: "#22c55e" },
          { bgColor: "rgba(239, 246, 255, 1)", iconColor: "#2563eb" },
          { bgColor: "rgba(255, 247, 237, 1)", iconColor: "#f59e0b" },
        ];
        const formattedData = response.map((item, index) => ({
          id: index,
          label: item.leave_type,
          available: item.remaining_days,
          booked: item.used_days,
          icon: icons[index % icons.length],
          bgColor: colors[index % colors.length].bgColor,
          iconColor: colors[index % colors.length].iconColor,
        }));
        setSummaryData(formattedData);
      }
    } catch (err) {
      toast.error("Error fetching summary");
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonalLeaves = async (empId) => {
    try {
      const res = await EmployeeOverViewService.getPersonalLeaveRequests(empId);
      if (res.success && res.data) setRequests(res.data);
      else {
        setRequests([]);
        // toast.warning("No personal leaves found");
      }
    } catch (err) {
      toast.error("Error fetching personal leaves");
    }
  };

  const fetchTeamLeaves = async (managerId) => {
    try {
      const res = await EmployeeOverViewService.getleavesByManager(managerId);
      if (res.success && res.data) setRequests(res.data);
      else setRequests([]);
    } catch (err) {
      toast.error("Error fetching team leaves");
    }
  };

  const fetchUpcomingHolidays = async () => {
    try {
      const res = await employeeHomeService.getUpcominngHolidays();
      if (res.success && res.data) setUpcomingHolidays(res.data);
    } catch (err) {
      toast.error("Error fetching holidays");
    }
  };

  // ---------------------- HANDLE CONFIRM LEAVE ----------------------
  const handleConfirmLeave = async (leaveId, action) => {
    try {
      const payload = {
        leave_id: leaveId,
        status: action === "Approve" ? "Approved" : "Rejected",
        approved_by: `${loggedInUserDetails.firstName} ${loggedInUserDetails.lastName}`,
      };

      const res = await EmployeeOverViewService.updateLeaveStatus(payload);
      if (res.success) {
        toast.success(`Leave ${action.toLowerCase()} successfully!`);
        // Update requests state
        const updatedRequests = requests.map((req) =>
          req.leave_id === leaveId
            ? { ...req, manager_status: action === "Approve" ? "Approved" : "Rejected" }
            : req
        );
        setRequests(updatedRequests);
      } else toast.error("Failed to update leave status.");
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setConfirmModal({ open: false, leaveId: null, action: "" });
    }
  };

  const handleApproveClick = (leaveId) => setConfirmModal({ open: true, leaveId, action: "Approve" });
  const handleRejectClick = (leaveId) => setConfirmModal({ open: true, leaveId, action: "Reject" });

  // ---------------------- EFFECTS ----------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwt_decode(token);
      setEmployeeData(decoded);
      fetchLeaveSummary(decoded.id);
      fetchUpcomingHolidays();
    } catch (err) {
      toast.error("Invalid token");
    }
  }, []);

  useEffect(() => {
    if (!employee) return;
    if (activeTab === "summary") fetchPersonalLeaves(employee.id);
    else if (activeTab === "request") fetchTeamLeaves(employee.id);
  }, [activeTab, employee]);

  // ---------------------- HANDLE ADD LEAVE ----------------------
  const handleAddLeave = async () => {
    setIsModalOpen(false);
    if (!employee?.id) return;
    await fetchLeaveSummary(employee.id);
    if (activeTab === "summary") await fetchPersonalLeaves(employee.id);
    else if (activeTab === "request") await fetchTeamLeaves(employee.id);
  };

  // ---------------------- JSX ----------------------
  return (
    <div className="p-6 pb-0 max-h-screen bg-white rounded-xl shadow-md font-sans">
      {/* Tabs + Add Leave Button */}
      <div className="flex justify-between items-center border-b border-gray-300 mb-6 py-2">
        <div className="flex">
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-6 py-2 text-xs font-semibold ${activeTab === "summary" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Personal Leave
          </button>
          <button
            onClick={() => setActiveTab("request")}
            className={`px-6 py-2 text-xs font-semibold ${activeTab === "request" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Team Leave Requests
          </button>
        </div>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white text-xs font-semibold rounded-lg shadow hover:shadow-lg transition-all duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="mr-2" /> Apply Personal Leave
        </motion.button>
      </div>

      {/* ------------------- PERSONAL SUMMARY ------------------- */}
      {activeTab === "summary" && (
        <>
          {/* Summary Cards */}
          <div className="flex flex-wrap gap-6 mb-6">
            {loading ? (
              <p className="text-gray-500 text-sm">Loading summary...</p>
            ) : summaryData.length === 0 ? (
              <p className="text-gray-500 text-sm">No summary data available</p>
            ) : (
              summaryData.map((card) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.id}
                    onClick={() => {
                      setSelectedLeaveType(card.label);
                      setIsModalOpen(true);
                    }}
                    className="cursor-pointer flex-1 min-w-[220px] max-w-[220px] p-6 rounded-xl flex flex-col items-center justify-center shadow-md bg-white"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
                  >
                    <p className="text-sm font-semibold text-gray-700 mb-3">{card.label}</p>
                    <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: card.bgColor, color: card.iconColor }}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex justify-between w-full mt-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 mb-1">Available</span>
                        <span className="text-xs font-medium text-gray-500">Booked</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-green-600 mb-1">{card.available}</span>
                        <span className="text-xs font-bold text-gray-800">{card.booked}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Upcoming Leaves & Holidays */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Personal Leaves Table */}
            <div className="flex-1 bg-white rounded-xl overflow-hidden ">
              <h2 className="py-3 px-4 text-sm font-semibold ">Personal Leaves</h2>
              <div className="px-2 rounded-xl overflow-x-auto max-h-[25vh] md:max-h-[20vh] lg:max-h-[20vh] xl:max-h-[23vh] overflow-y-auto">
                <table className="min-w-full divide-y rounded-xl">
                  <thead className="bg-purple-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Leave Type</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">From</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">To</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Used</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Remaining</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {requests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-400">No upcoming leaves</td>
                      </tr>
                    ) : (
                      requests.map((req, idx) => (
                        <tr key={req.leave_id || idx} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-xs text-gray-700">{req.leave_type}</td>
                          <td className="px-4 py-2 text-xs text-gray-600">{req.start_date}</td>
                          <td className="px-4 py-2 text-xs text-gray-600">{req.end_date}</td>
                          <td className="px-4 py-2 text-xs text-gray-600">{req.total_days} days</td>
                          <td className="px-4 py-2 text-xs text-gray-600">{req.used_days} days</td>
                          <td className="px-4 py-2 text-xs text-gray-600">
                            <span className={`px-2 py-1 rounded font-medium ${req.remaining_days <= 2 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                              {req.remaining_days} days
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Upcoming Holidays Table */}
            <div className="flex-1 bg-white rounded-xl overflow-hidden">
              <h2 className="py-3 px-4 text-sm font-semibold">Upcoming Holidays</h2>
              <div className="px-2 overflow-x-auto max-h-[25vh] md:max-h-[20vh] lg:max-h-[20vh] xl:max-h-[23vh] overflow-y-auto">
                <table className="min-w-full divide-y rounded-xl">
                  <thead className="bg-purple-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {upcomingHolidays.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-gray-400 text-sm">No upcoming leaves</td>
                      </tr>
                    ) : (upcomingHolidays.map((holiday, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-xs text-gray-700">{formatHolidayDate(holiday.date)}</td>
                        <td className="px-4 py-2 text-xs text-gray-700">{holiday.description}</td>
                      </tr>
                    ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ------------------- TEAM LEAVE REQUESTS ------------------- */}
      {activeTab === "request" && (
        <div className="bg-white border-gray-200 overflow-hidden p-4 rounded-xl">
          <div className="flex gap-2 mb-4">
            {["Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setTeamLeaveFilter(status)}
                className={`px-4 py-1 rounded-full text-xs font-semibold ${teamLeaveFilter === status ? "bg-purple-600 text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-purple-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Leave Type</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">From</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">To</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Used</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Remaining</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.filter(r => r.manager_status === teamLeaveFilter).length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center text-gray-400 text-sm">No leaves present</td>
                  </tr>
                ) : (
                  requests.filter(r => r.manager_status === teamLeaveFilter).map((req, idx) => (
                    <motion.tr
                      key={req.leave_id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-2 text-xs text-gray-600">{req.first_name} {req.last_name}</td>
                      <td className="px-4 py-2 text-xs text-gray-700">{req.leave_type}</td>
                      <td className="px-4 py-2 text-xs text-gray-600">{req.start_date}</td>
                      <td className="px-4 py-2 text-xs text-gray-600">{req.end_date}</td>
                      <td className="px-4 py-2 text-xs text-gray-600"><span className={`px-2 py-1 font-medium rounded ${req.total_days > 10 ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>{req.total_days} days</span></td>
                      <td className="px-4 py-2 text-xs text-gray-600"><span className={`px-2 py-1 rounded font-medium ${req.used_days > 5 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>{req.used_days} days</span></td>
                      <td className="px-4 py-2 text-xs text-gray-600"><span className={`px-2 py-1 rounded font-medium ${req.remaining_days <= 2 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>{req.remaining_days} days</span></td>
                      <td className="px-4 py-2 text-xs"><span className={`${statusStyles[req.manager_status].bg} ${statusStyles[req.manager_status].text} px-2 py-1 rounded-full text-xs font-semibold`}>{req.manager_status}</span></td>
                      <td className="px-4 py-2">
                        {req.manager_status === "Pending" && (
                          <div className="flex gap-2">
                            <button onClick={() => handleApproveClick(req.leave_id)} className="font-medium bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs hover:bg-green-200">Approve</button>
                            <button onClick={() => handleRejectClick(req.leave_id)} className="font-medium bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs hover:bg-red-200">Reject</button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------- ADD LEAVE MODAL ------------------- */}
      <AddLeaveModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedLeaveType(null); }}
        onSubmit={handleAddLeave}
        preselectedType={selectedLeaveType}
      />

      {/* ------------------- CONFIRM MODAL ------------------- */}
      {confirmModal.open && (
        <ConfirmStatusModal
          isOpen={confirmModal.open}
          status={confirmModal.action}
          onClose={() => setConfirmModal({ open: false, leaveId: null, action: "" })}
          onConfirm={() => handleConfirmLeave(confirmModal.leaveId, confirmModal.action)}
        />
      )}
    </div>
  );
}
