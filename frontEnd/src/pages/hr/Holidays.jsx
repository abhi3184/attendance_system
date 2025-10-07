import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaCalendarAlt, FaEdit } from "react-icons/fa";
import AddHolidayModal from "../../modals/addHoliday";
import axios from "axios";
import toast from "react-hot-toast";

export default function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentHoliday, setCurrentHoliday] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteHoliday, setDeleteHoliday] = useState(null);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/holidays/get_holidays");
      if (Array.isArray(res.data?.data)) {
        setHolidays(res.data.data);
        setFiltered(res.data.data);
      } else {
        toast.error("Failed to fetch holidays");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching holidays");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/holidays/${id}`);
      setHolidays((prev) => prev.filter((h) => h.id !== id));
      setFiltered((prev) => prev.filter((h) => h.id !== id));
      toast.success("Holiday deleted successfully!");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearch(val);
    setFiltered(
      holidays.filter(
        (h) =>
          h.description.toLowerCase().includes(val) ||
          h.type.toLowerCase().includes(val)
      )
    );
  };

  const openEditModal = (holiday) => {
    setCurrentHoliday(holiday);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCurrentHoliday(null);
  };

  return (
    <div className="flex-1 flex flex-col max-h-full p-6 rounded-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Company Holidays</h1>
          <p className="text-gray-500 text-sm">Manage your official and optional holidays.</p>
        </div>

        <div className="flex gap-3 items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModalOpen(true)}
            className="flex items-center px-6 py-2 bg-gradient-to-r text-xs from-purple-600 to-purple-800 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <FaPlus className="mr-2" /> Add Holiday
          </motion.button>
        </div>
      </div>

      {/* Holiday Count */}
      <div className="text-sm text-gray-600 mb-4">
        Total Holidays: <span className="font-semibold text-indigo-700">{filtered.length}</span>
      </div>

      {/* Holiday Cards Grid */}
      {loading ? (
        <p className="text-center text-gray-500 py-10">Loading holidays...</p>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-gray-400"
        >
          <FaCalendarAlt className="text-5xl mb-3 opacity-60" />
          <p className="text-lg">No holidays found</p>
          <p className="text-sm text-gray-400">Click “Add Holiday” to create one.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((holiday, idx) => (
            <motion.div
              key={holiday.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="bg-white/70 shadow-md backdrop-blur-md border border-purple-100 rounded-2xl p-5 hover:shadow-sm transition-all relative"
            >
              {/* Date and Type */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-purple-700 font-medium text-sm">
                  <FaCalendarAlt />
                  <span>{holiday.date}</span>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${holiday.type === "National"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-amber-100 text-amber-800"
                    }`}
                >
                  {holiday.type || "General"}
                </span>
              </div>

              {/* Description */}
              <h2 className="text-md font-semibold text-gray-800 mb-1 truncate">
                {holiday.description}
              </h2>

              {/* Actions: Icon only */}
              <div className="absolute bottom-2 right-2 flex gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openEditModal(holiday)}
                  className="p-2 bg-purple-500 text-white rounded-full shadow hover:bg-purple-600"
                  title="Edit"
                >
                  <FaEdit className="w-3 h-3" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeleteHoliday(holiday)}
                  className="p-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600"
                  title="Delete"
                >
                  <FaTrash className="w-3 h-3" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <AddHolidayModal
          holiday={currentHoliday}
          onClose={handleModalClose}
          onSave={fetchHolidays}
          isOpen={modalOpen}
        />
      )}

      {deleteHoliday && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[350px] text-center shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Confirm Delete
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete "{deleteHoliday.description}"?
            </p>
            <div className="flex justify-center gap-3">
              <motion.button>
                <button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1 text-sm bg-gray-300 rounded-lg hover:bg-gray-400"
                  onClick={() => setDeleteHoliday(null)}
                >
                  Cancel
                </button>
              </motion.button>
              <motion.button>
                <button
                  className="px-4 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                  onClick={() => {
                    handleDelete(deleteHoliday.id);
                    setDeleteHoliday(null);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </button>
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
