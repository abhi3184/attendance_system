import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import imageUrl from '../assets/background/bg.49756b7c711696d95133fa95451f8e13.svg';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const passedEmail = location.state?.email || "";

    const [email, setEmail] = useState(passedEmail || localStorage.getItem("forgotEmail") || "");
    const [emailError, setEmailError] = useState("");
    const [otpSent, setOtpSent] = useState(localStorage.getItem("otpSent") === "true");
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [timeLeft, setTimeLeft] = useState(() => {
        const expiry = localStorage.getItem("otpExpiry");
        return expiry ? Math.max(Math.floor((expiry - Date.now()) / 1000), 0) : 300;
    });

    useEffect(() => {
        if (!otpSent) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                const newTime = prev > 0 ? prev - 1 : 0;
                if (newTime === 0) localStorage.removeItem("otpSent");
                return newTime;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [otpSent]);

    const handleSendOtp = async () => {
        if (!email.trim()) {
            setEmailError("Email is required");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post("http://127.0.0.1:8000/auth/send-otp", { email });
            setLoading(false);

            if (response.data.success) {
                toast.success("OTP sent to your email");
                setOtpSent(true);
                localStorage.setItem("forgotEmail", email);
                localStorage.setItem("otpSent", "true");
                localStorage.setItem("otpExpiry", Date.now() + 5 * 60 * 1000);
                setTimeLeft(300);
            } else toast.error(response.data.message || "Failed to send OTP");
        } catch (err) {
            setLoading(false);
            toast.error("Error sending OTP");
        }
    };

    const handleChangeOtp = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join("");
        if (otpString.length < 6) return toast.error("Enter full OTP");

        try {
            setLoading(true);
            const response = await axios.post("http://127.0.0.1:8000/auth/verify-otp", { email, otp: otpString });
            setLoading(false);

            if (response.data.success) {
                toast.success("OTP verified! You can now reset your password.");
                localStorage.removeItem("otpSent");
                localStorage.removeItem("otpExpiry");
                localStorage.removeItem("forgotEmail");
                // Show reset password fields here
            } else toast.error(response.data.message || "Invalid OTP");
        } catch (err) {
            setLoading(false);
            toast.error("OTP verification failed");
        }
    };

    const handleResendOtp = async () => {
        try {
            setLoading(true);
            await axios.post("http://127.0.0.1:8000/auth/send-otp", { email });
            setLoading(false);
            localStorage.setItem("otpExpiry", Date.now() + 5 * 60 * 1000);
            setTimeLeft(300);
            toast.success("OTP resent");
        } catch (err) {
            setLoading(false);
            toast.error("Failed to resend OTP");
        }
    };

    const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

    return (
        <div className="w-full h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative">
            <img src={imageUrl} alt="bg" className="absolute inset-0 w-full h-full object-cover z-0" />
            <motion.div
                className="w-full max-w-md bg-white p-8 md:p-12 rounded-2xl shadow-xl z-10"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <h2 className="text-3xl font-bold text-purple-700 text-center mb-10">Forgot Password</h2>

                <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Email</label>
                <motion.input
                    type="email"
                    id="email"
                    value={email}
                    disabled={!!passedEmail}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    className={`w-full px-4 py-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${emailError ? "border-red-500" : "border-gray-300"} ${passedEmail ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    whileFocus={{ scale: 1.02 }}
                />
                {emailError && <span className="text-red-500 text-sm">{emailError}</span>}

                {!otpSent && (
                    <motion.button
                        onClick={handleSendOtp}
                        className="w-full py-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 shadow-md"
                        whileHover={{ scale: 1.03, boxShadow: "0px 4px 12px rgba(0,0,0,0.2)" }}
                        whileTap={{ scale: 0.97 }}
                        disabled={loading}
                    >
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </motion.button>
                )}

                {otpSent && (
                    <div className="mt-6">
                        <p className="mb-2 text-center">Enter OTP sent to <strong>{email}</strong></p>
                        <div className="flex justify-between mb-4">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    value={digit}
                                    onChange={(e) => handleChangeOtp(index, e.target.value)}
                                    className="border rounded w-10 h-12 text-center text-xl"
                                    maxLength={1}
                                />
                            ))}
                        </div>
                        <motion.button
                            onClick={handleVerifyOtp}
                            className="w-full py-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 shadow-md mb-2"
                            whileHover={{ scale: 1.03, boxShadow: "0px 4px 12px rgba(0,0,0,0.2)" }}
                            whileTap={{ scale: 0.97 }}
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </motion.button>

                        <div className="flex justify-between items-center text-sm">
                            <span>Expires in: {formatTime(timeLeft)}</span>
                            <button
                                onClick={handleResendOtp}
                                disabled={loading || timeLeft > 0}
                                className={`text-purple-700 font-semibold ${timeLeft > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                Resend OTP
                            </button>
                        </div>
                    </div>
                )}

                <span
                    className="text-purple-700 text-sm mt-6 block text-center cursor-pointer hover:underline"
                    onClick={() => navigate("/login")}
                >
                    Back to Login
                </span>
            </motion.div>
        </div>
    );
}
