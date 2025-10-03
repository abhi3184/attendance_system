// FancyDropdown.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FancyDropdown = ({ options, value, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex-1">
      <div
        onClick={() => setOpen(!open)}
        className="border rounded px-3 py-2 cursor-pointer flex justify-between items-center shadow-sm hover:ring-2 hover:ring-purple-500 transition"
      >
        {value}
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 right-0 bg-white border rounded shadow mt-1 z-[1001] max-h-40 overflow-y-auto"
          >
            {options.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className="px-3 py-2 hover:bg-purple-100 cursor-pointer"
              >
                {opt}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FancyDropdown;
