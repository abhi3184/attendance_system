import React from "react";
import { motion } from "framer-motion";

const FullScreenLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-800 text-white z-[9999]"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-20 h-20 border-4 border-white border-t-transparent rounded-full mb-6"
      ></motion.div>

      <motion.h2
        className="text-xl font-semibold tracking-wide"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Logging in...
      </motion.h2>
    </motion.div>
  );
};

export default FullScreenLoader;
