// src/components/modals/ConfirmStatusModal.jsx
import React from "react";
import { motion } from "framer-motion";

const ConfirmStatusModal = ({ isOpen, onClose, onConfirm, status }) => {
  if (!isOpen) return null;

  const isApprove = status === "Approved";
  const title = isApprove ? "Approve Leave" : "Reject Leave";
  const message = isApprove
    ? "Are you sure you want to approve this leave request?"
    : "Are you sure you want to reject this leave request?";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 w-96 shadow-lg"
      >
        <h2 className="text-lg font-semibold mb-3">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-1.5 text-sm rounded-lg text-white ${
              isApprove
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isApprove ? "Approve" : "Reject"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmStatusModal;
