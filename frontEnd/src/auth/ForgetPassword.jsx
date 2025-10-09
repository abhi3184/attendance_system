import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import imageUrl from "../assets/background/bg.49756b7c711696d95133fa95451f8e13.svg";
import OtpBox from "./otpInput";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const passedEmail = location.state?.email || "";

  const [email, setEmail] = useState(
    passedEmail || localStorage.getItem("forgotEmail") || ""
  );
  const [emailError, setEmailError] = useState("");
  const [otpSent, setOtpSent] = useState(localStorage.getItem("otpSent") === "true");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(() => {
    const expiry = localStorage.getItem("otpExpiry");
    return expiry ? Math.max(Math.floor((expiry - Date.now()) / 1000), 0) : 300;
  });
  const [otpVerified, setOtpVerified] = useState(false);

  // Password reset states
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Live password validation
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    special: false,
    match: false,
  });

  // 🕒 Timer
  useEffect(() => {
    if (!otpSent) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev > 0 ? prev - 1 : 0;
        if (newTime === 0) localStorage.removeItem("otpSent");
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [otpSent]);

  // 📤 Send OTP
  const handleSendOtp = async () => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `http://127.0.0.1:8000/otp/send-otp/?emailId=${email}`
      );
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

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length < 6) return toast.error("Enter full OTP");

    try {
      setLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/otp/verify-email-otp",
        { email, otp }
      );
      setLoading(false);

      if (response.data.success) {
        toast.success("OTP verified successfully!");
        setOtpVerified(true);
        localStorage.removeItem("otpSent");
        localStorage.removeItem("otpExpiry");
      } else toast.error(response.data.message || "Invalid OTP");
    } catch (err) {
      setLoading(false);
      toast.error("OTP verification failed");
    }
  };

  // 🔁 Resend OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      await axios.post(`http://127.0.0.1:8000/otp/send-otp/?emailId=${email}`);
      setLoading(false);
      localStorage.setItem("otpExpiry", Date.now() + 5 * 60 * 1000);
      setTimeLeft(300);
      toast.success("OTP resent");
    } catch (err) {
      setLoading(false);
      toast.error("Failed to resend OTP");
    }
  };

  // 🔒 Live password validation
  useEffect(() => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
      match: password && password === confirmPassword,
    });
  }, [password, confirmPassword]);

  // 🧩 Handle password update
  const handleUpdatePassword = async () => {
    const allValid = Object.values(passwordValidation).every(Boolean);
    if (!allValid) {
      setPasswordError("Please fix all password requirements.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        "http://127.0.0.1:8000/auth/update-password",
        { email, password }
      );
      setLoading(false);

      if (response.data.success) {
        toast.success("Password updated successfully!");
        localStorage.removeItem("forgotEmail");
        navigate("/login");
      } else toast.error(response.data.message || "Failed to update password");
    } catch (err) {
      setLoading(false);
      toast.error("Error updating password");
    }
  };

  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  const getValidationClass = (valid) => (valid ? "text-green-600" : "text-red-500");

  return (
    <div className="w-full h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative">
      <img
        src={imageUrl}
        alt="bg"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <motion.div
        className="w-full max-w-md bg-white p-4 md:p-6 rounded-2xl shadow-xl z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-10">
          Forgot Password
        </h2>

        {/* Step 1: Email */}
        {!otpSent && !otpVerified && (
          <>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
              Email
            </label>
            <motion.input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              className={`w-full px-4 py-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${emailError ? "border-red-500" : "border-gray-300"
                }`}
              whileFocus={{ scale: 1.02 }}
            />
            {emailError && <span className="text-red-500 text-sm">{emailError}</span>}

            <motion.button
              onClick={handleSendOtp}
              className="w-full py-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 shadow-md mt-4"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </motion.button>
          </>
        )}

        {/* Step 2: OTP */}
        {otpSent && !otpVerified && (
          <div className="mt-6">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <div className="mb-2 text-gray-800 font-semibold">{email}</div>

            <label className="block text-gray-700 font-medium mb-2">Enter OTP</label>
            <OtpBox value={otp} onChange={setOtp} />
            <motion.button
              onClick={handleVerifyOtp}
              className="w-full py-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 shadow-md mb-2 mt-5"
              whileHover={{ scale: 1.03 }}
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
                className={`text-purple-700 font-semibold ${timeLeft > 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Reset Password */}
        {otpVerified && (
          <div className="mt-6">
            <label className="block text-gray-700 font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label className="block text-gray-700 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border-gray-300"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* Live password messages */}
            <div className="text-sm mb-2">
              <p className={getValidationClass(passwordValidation.length)}>
                • At least 8 characters
              </p>
              <p className={getValidationClass(passwordValidation.uppercase)}>
                • At least 1 uppercase letter
              </p>
              <p className={getValidationClass(passwordValidation.lowercase)}>
                • At least 1 lowercase letter
              </p>
              <p className={getValidationClass(passwordValidation.digit)}>
                • At least 1 digit
              </p>
              <p className={getValidationClass(passwordValidation.special)}>
                • At least 1 special character (@$!%*?&)
              </p>
              <p className={getValidationClass(passwordValidation.match)}>
                • Passwords match
              </p>
            </div>

            <motion.button
              onClick={handleUpdatePassword}
              className="w-full py-3 mt-4 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 shadow-md"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </motion.button>
          </div>
        )}

        <span
          className="text-purple-700 text-sm mt-6 block text-center cursor-pointer hover:underline"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Back to Login
        </span>
      </motion.div>
    </div>
  );
}
