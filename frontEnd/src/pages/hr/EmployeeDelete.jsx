import React from "react";
import Modal from "../../modals/modal";
import { motion } from "framer-motion";

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, employee }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete">
      <p className="text-sm text-gray-700">
        Are you sure you want to delete <strong>{employee?.firstName} {employee?.lastName}</strong>?
      </p>

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm"
        >
          Cancel
        </button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onConfirm(employee)}
          className="px-4 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
        >
          Delete
        </motion.button>
      </div>
    </Modal>
  );
};
