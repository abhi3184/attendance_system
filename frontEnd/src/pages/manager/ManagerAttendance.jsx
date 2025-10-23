import React, { useEffect, useState } from "react";
import FancyDropdown from "../../components/dropdowns";
import { attendanceTrackerService } from "../../api/services/manager/attedanceTrackerService";
import { getDecodedToken } from "../../utils/JWTHelper";
import { motion } from "framer-motion";
const filterOptions = ["Today", "Yesterday", "Last Week", "Last Month"];
import { FaCalendarAlt } from "react-icons/fa";

export default function ManagerAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Today");
  const [loading, setLoading] = useState(false);


  const token = localStorage.getItem("token"); // or your storage key
  const decoded = getDecodedToken(token);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await attendanceTrackerService.getAttendanceForManager(
        decoded.id,
        filterType.toLowerCase().replace(" ", "_")
      );
      if (res.success && res.data) {
        setAttendance(res.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [filterType]);

  const filtered = attendance.filter(emp =>
    emp.emp_name?.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (datetimeStr) => {
    if (!datetimeStr) return "NA";
    const dt = new Date(datetimeStr);
    let hours = dt.getHours();
    const minutes = dt.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="flex-1 flex flex-col max-h-full p-4 relative bg-white rounded-xl shadow-md">
      {/* Search + Dropdown */}
      <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search employee..."
          className="border border-gray-300 rounded-lg px-4 py-2 text-xs flex-1 max-w-[300px] focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Dropdown on the right with smaller width */}
        <div className="w-[150px]">
          <FancyDropdown
            options={filterOptions}
            value={filterType}
            onChange={(val) => setFilterType(val)}
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-auto rounded-2xl">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-in</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-out</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">On Time</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Early Left</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center py-10 text-gray-500"
                    >
                      <div className="bg-purple-50 rounded-full p-6 shadow-sm mb-4">
                        <FaCalendarAlt className="text-purple-500 text-4xl" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-700 mb-1">
                        No employees attendance found 😢
                      </h3>
                      <p className="text-xs text-gray-400 text-center max-w-xs">
                        Please add employee.
                      </p>
                    </motion.div>
                  </td>
                </tr>
              ) : filtered.map(emp => (
                <tr key={emp.attendance_id || emp.emp_id} className="hover:bg-purple-50 cursor-pointer transition">
                  {emp.is_holiday ? (
                    <td colSpan={6} className="px-4 py-2 text-xs text-center bg-blue-100 text-blue-800 font-medium">
                      {emp.date} Holiday: {emp.holiday_description}
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-2 text-xs">{emp.emp_name}</td>
                      <td className="px-4 py-2 text-xs">
                        <span className={`px-2 py-1 rounded font-medium ${emp.isPresent ? "bg-green-300 text-green-800" : "bg-red-300 text-red-800"
                          }`}>
                          {emp.isPresent ? "Present" : "Absent"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-xs">{emp.check_in_time}</td>
                      <td className="px-4 py-2 text-xs">{emp.check_out_time}</td>
                      <td className="px-4 py-2 text-xs">{emp.late || "NA"}</td>
                      <td className="px-4 py-2 text-xs">{emp.early || "NA"}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
