import React, { useState, useEffect} from "react";
import { motion } from "framer-motion";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AddHolidayModal from "../../modals/addHoliday";
import axios from "axios";
import toast from "react-hot-toast";

const initialHolidays = [
  { id: 1, date: "2025-01-26", name: "Republic Day", type: "National" },
  { id: 2, date: "2025-03-17", name: "Holi", type: "Festival" },
  { id: 3, date: "2025-08-15", name: "Independence Day", type: "National" },
];

export default function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdd = (newHoliday) => {
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setHolidays(holidays.filter((h) => h.id !== id));
  };


  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/holidays/get_upcoming_holidays");
      if (Array.isArray(res.data?.data))
        setHolidays(res.data.data);
      else toast.error("Failed to fetch employees");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHolidays(); }, []);

  return (
    <div className="flex-1 flex flex-col max-h-full p-4 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800"></h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalOpen(true)}
          className="flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-xs text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <FaPlus className="mr-2" /> Add Holiday
        </motion.button>
      </div>

      {/* Table */}
      <div className="flex-1 flex flex-col bg-white rounded-xl overflow-hidden">
        <div className="overflow-y-auto">
          <table className="w-full table-auto divide-y divide-gray-200">
            <thead className="bg-purple-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Holiday Name</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {holidays.map((holiday, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ backgroundColor: "rgba(243,232,255,0.2)" }}
                >
                  <td className="px-4 py-2 text-xs whitespace-nowrap">{holiday.date}</td>
                  <td className="px-4 py-2 text-xs whitespace-nowrap">{holiday.description}</td>
                  <td className="px-4 py-2 text-xs whitespace-nowrap">{holiday.type}</td>
                  <td className="px-4 py-2 text-xs whitespace-nowrap flex gap-2">
                    <motion.button className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded shadow hover:bg-purple-700 text-[11px]">
                      <FaEdit className="h-3 w-3" /> Edit
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(holiday.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded shadow hover:bg-red-700 text-[11px]"
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

      {/* Modal */}
      <AddHolidayModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAdd}
      />
    </div>
  );
}
