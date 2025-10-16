import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FancyDropdown = ({ options = [], value, onChange, placeholder = "Select" }) => {
  const [open, setOpen] = useState(false);

  // Determine if options are objects or strings
  const isObject = options.length > 0 && typeof options[0] === "object";

  // Display selected value
  const displayValue = isObject
    ? options.find((o) => o.value === value)?.label
    : value;

  return (
    <div className="relative flex-1">
      <div
        onClick={() => setOpen(!open)}
        className="border border-gray-300 text-sm rounded-lg px-3 py-2 cursor-pointer flex justify-between items-center shadow-sm hover:ring-2 hover:ring-purple-500 transition"
      >
        <span className={displayValue ? "text-gray-900" : "text-gray-400"}>
          {displayValue || placeholder}
        </span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute text-xs top-full left-0 right-0 bg-white border rounded shadow mt-1 z-[1001] max-h-40 overflow-y-auto"
          >
            {options.map((opt) => {
              const label = isObject ? opt.label : opt;
              const val = isObject ? opt.value : opt;

              return (
                <li
                  key={val}
                  onClick={() => {
                    onChange(val);
                    setOpen(false);
                  }}
                  className="px-3 py-2 hover:bg-purple-100 cursor-pointer"
                >
                  {label}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FancyDropdown;
   