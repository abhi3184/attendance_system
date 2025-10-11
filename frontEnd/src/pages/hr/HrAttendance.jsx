import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { hrAttendanceService } from "../../api/services/hrDashboard/hrAttendanceService";

export default function HrAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [search, setSearch] = useState("");

  const today = dayjs().format("DD-MM-YYYY");

  const fetchAttendance = async () => {
    try {
      const res = await hrAttendanceService.getAllAttendance();
      if (res.success && res.data) {
        setAttendanceData(res.data);
      }
    } catch (err) {
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const filteredData = attendanceData.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatus = (emp) => {
    const checkInDate = emp.check_in_time ? dayjs(emp.check_in_time).format("YYYY-MM-DD") : null;
    const checkOutDate = emp.check_out_time ? dayjs(emp.check_out_time).format("YYYY-MM-DD") : null;

    if (!checkInDate && !checkOutDate) return { label: "Yet to check-in", color: "blue" };
    if (checkInDate && !checkOutDate) return { label: "Present", color: "yellow" };
    if (checkInDate && checkOutDate) return { label: "Checked-Out", color: "green" };

    return { label: "-", color: "gray" };
  };

  const formatTime = (datetime) => {
    if (!datetime) return "-";
    const d = new Date(datetime);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const colClass = "px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider";

  return (
    <div className="flex-1 flex flex-col max-h-full p-4 bg-white rounded-xl shadow-md">
      {/* Search */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search employee..."
          className="border rounded-lg text-xs px-4 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="flex-1 flex flex-col bg-white rounded-xl overflow-hidden border">
        {/* Table Header */}
        <div className=" border-b">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <thead className="bg-purple-100 sticky top-0 z-10">
              <tr>
                <th className={colClass}>Name</th>
                <th className={colClass}>Shift</th>
                <th className={colClass}>Date</th>
                <th className={colClass}>Check-In</th>
                <th className={colClass}>Check-Out</th>
                <th className={colClass}>Worked Hours</th>
                <th className={colClass}>Status</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500 text-sm">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                filteredData.map((emp, idx) => {
                  const status = getStatus(emp);
                  return (
                    <motion.tr
                      key={emp.emp_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.005 }}
                      whileHover={{ backgroundColor: "rgba(243,232,255,0.2)" }}
                    >
                      <td className="px-4 py-2 text-xs">{emp.name}</td>
                      <td className="px-4 py-2 text-xs">{emp.shift}</td>
                      <td className="px-4 py-2 text-xs">{today}</td>
                      <td className="px-4 py-2 text-xs">{formatTime(emp.check_in_time)}</td>
                      <td className="px-4 py-2 text-xs">{formatTime(emp.check_out_time)}</td>
                      <td className="px-4 py-2 text-xs">{emp.worked_hours?.toFixed(2) ?? "-"}</td>
                      <td className="px-4 py-2 text-xs">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            status.color === "green"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : status.color === "yellow"
                              ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                              : status.color === "red"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : "bg-blue-100 text-blue-700 border-blue-200"
                          }`}
                        >
                          {status.label}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
