import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const initialHolidays = [
  { id: 1, date: "2025-01-26", name: "Republic Day", type: "National" },
  { id: 2, date: "2025-03-17", name: "Holi", type: "Festival" },
  { id: 3, date: "2025-08-15", name: "Independence Day", type: "National" },
];

export default function Holidays() {
  const [holidays, setHolidays] = useState(initialHolidays);

  const handleAdd = () => {
    const newHoliday = {
      id: holidays.length + 1,
      date: "2025-12-25",
      name: "Christmas",
      type: "Festival",
    };
    setHolidays([...holidays, newHoliday]);
  };

  const handleDelete = (id) => {
    setHolidays(holidays.filter((h) => h.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col h-full p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Holidays</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="flex items-center px-6 py-2 bg-gradient-to-r text-xs from-purple-600 to-purple-800 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <FaPlus className="mr-2" /> Add Holiday
        </motion.button>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto divide-y divide-gray-200">
            <thead className="bg-purple-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[40%]">Holiday Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">Actions</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto pb-4">
          <table className="w-full table-auto divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-100">
              {holidays.map((holiday, idx) => (
                <motion.tr
                  key={holiday.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ backgroundColor: "rgba(243,232,255,0.2)" }}
                >
                  <td className="px-4 py-2 text-xs whitespace-nowrap w-[20%]">{holiday.date}</td>
                  <td className="px-4 py-2 text-xs whitespace-nowrap w-[40%]">{holiday.name}</td>
                  <td className="px-4 py-2 text-xs whitespace-nowrap w-[20%]">{holiday.type}</td>
                  <td className="px-4 py-2 text-xs whitespace-nowrap w-[20%] flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded shadow hover:bg-purple-700 transition-all text-[11px]"
                    >
                      <FaEdit className="h-3 w-3" /> Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(holiday.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded shadow hover:bg-red-700 transition-all text-[11px]"
                    >
                      <FaTrash className="h-3 w-3" /> Delete
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
