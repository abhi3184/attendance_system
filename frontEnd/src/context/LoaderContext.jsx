// src/context/LoaderContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { loaderController } from "./loaderController";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loaderController.register(setLoading);
    return () => loaderController.register(null);
  }, []);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="global-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
            style={{ background: "linear-gradient(135deg,#6D28D9 0%, #2563EB 100%)" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mb-6"
            />
            <motion.h2
              className="text-white text-lg font-semibold"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading dashboard...
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
