import React, { useState } from "react";
import { motion } from "framer-motion";
import imageUrl from '../assets/background/bg.49756b7c711696d95133fa95451f8e13.svg'
import { useNavigate } from "react-router-dom";

export default function ForgotPassword({ email, onBack }) {
    const navigate = useNavigate();
    const [emailInput, setEmailInput] = useState(email || "");

    const handleSendReset = () => {
        alert(`Password reset link sent to ${emailInput}`);
        if (onBack) onBack();
    };
    //  return <img src={imageUrl} alt="bg test" />;

    return (

        <div className="w-full h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat">
            <img
                src={imageUrl}
                alt="bg"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            <motion.div
                className="w-full max-w-md bg-white p-8 md:p-12 rounded-2xl shadow-xl z-10"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <h2 className="text-3xl font-bold text-purple-700 text-center mb-10">
                    Forgot Password
                </h2>

                <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                    Email
                </label>
                <motion.input
                    type="email"
                    id="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    whileFocus={{ scale: 1.02 }}
                />

                <motion.button
                    onClick={handleSendReset}
                    className="w-full py-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 shadow-md"
                    whileHover={{ scale: 1.03, boxShadow: "0px 4px 12px rgba(0,0,0,0.2)" }}
                    whileTap={{ scale: 0.97 }}
                >
                    Send Reset Link
                </motion.button>

                <span
                    className="text-purple-700 text-sm mt-4 block text-center cursor-pointer hover:underline"
                    onClick={() => navigate("/login")}
                >
                    Back to Login
                </span>
            </motion.div>
        </div>
    );
}
