// Holidays.jsx
import React from "react";
import { motion } from "framer-motion";
import { CalendarIcon } from "@heroicons/react/24/outline";

const holidays = [
  { id: 1, name: "New Year", date: "2026-01-01", day: "Friday" },
  { id: 2, name: "Republic Day", date: "2026-01-26", day: "Monday" },
  { id: 3, name: "Company Event", date: "2026-02-15", day: "Sunday" },
  { id: 4, name: "Diwali", date: "2026-11-02", day: "Monday" },
];

export default function Holidays() {
  return (
    <div className="overflow-auto p-2 h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {holidays.map((holiday, idx) => (
          <motion.div
            key={holiday.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-xl p-2 pl-5 cursor-pointer border border-purple-400"
            style={{
              borderLeftWidth: "4px",
              borderRightWidth: "1px",
              borderTopWidth: "1px",
              borderBottomWidth: "1px",
              borderLeftColor: "#7C3AED",
            }}
          >
            {/* Holiday Name */}
            <div className="text-sm font-semibold text-gray-800 mb-2">{holiday.name}</div>

            {/* Date + Day */}
            <div className="flex items-center gap-2 text-gray-600 text-xs">
              <CalendarIcon className="h-4 w-4 text-purple-500" />
              <span>{holiday.date}, {holiday.day}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
