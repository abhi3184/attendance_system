// Holidays.jsx
import React from "react";
import { motion } from "framer-motion";
import { CalendarIcon } from "@heroicons/react/24/outline";

export default function Holidays({ holidays = [] }) {
  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    const dateObj = new Date(isoDate);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getDayName = (isoDate) => {
    if (!isoDate) return "";
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleDateString("en-US", { weekday: "long" });
  };

  return (
    <div className="overflow-auto p-4 h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {holidays && holidays.length > 0 ? (
          holidays.map((holiday, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-xl p-3 pl-5 cursor-pointer border border-purple-400 shadow-sm"
              style={{
                borderLeftWidth: "4px",
                borderRightWidth: "1px",
                borderTopWidth: "1px",
                borderBottomWidth: "1px",
                borderLeftColor: "#7C3AED",
              }}
            >
              {/* Holiday Name */}
              <div className="text-sm font-semibold text-gray-800 mb-2">
                {holiday.description}
              </div>

              {/* Date + Day */}
              <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                <CalendarIcon className="h-4 w-4 text-purple-500" />
                <span>
                  {formatDate(holiday.date)}, {getDayName(holiday.date)}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            className="col-span-full flex justify-center items-center h-40"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              type: "spring",
              stiffness: 120,
            }}
          >
            <motion.p
              className="text-center text-gray-500 text-base font-medium"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              No holidays found 🎉
            </motion.p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
