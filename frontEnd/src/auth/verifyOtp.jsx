import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function OTPVerification({ email }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(() => {
    const expiry = localStorage.getItem("otpExpiry");
    return expiry ? Math.max(Math.floor((expiry - Date.now()) / 1000), 0) : 300;
  });
  const [loading, setLoading] = useState(false);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev > 0 ? prev - 1 : 0;
        if (newTime === 0) localStorage.removeItem("otpSent"); // allow resend
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
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
        // Clear OTP from localStorage after verification
        localStorage.removeItem("otpSent");
        localStorage.removeItem("otpExpiry");
        localStorage.removeItem("forgotEmail");
        // Show reset password form or redirect
      } else {
        toast.error(response.data.message || "Invalid OTP");
      }
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
      const newExpiry = Date.now() + 5 * 60 * 1000;
      localStorage.setItem("otpExpiry", newExpiry);
      setTimeLeft(300);
      toast.success("OTP resent");
    } catch (err) {
      setLoading(false);
      toast.error("Failed to resend OTP");
    }
  };

  const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  return (
    <div className="mt-4">
      <p className="mb-2">Enter the OTP sent to <strong>{email}</strong></p>

      <div className="flex justify-between mb-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            className="border rounded w-10 h-12 text-center text-xl"
            maxLength={1}
          />
        ))}
      </div>

      <button
        onClick={handleVerifyOtp}
        disabled={loading}
        className="w-full mt-2 bg-blue-600 text-white py-2 rounded"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <div className="flex justify-between mt-2 items-center text-sm">
        <span>Expires in: {formatTime(timeLeft)}</span>
        <button
          onClick={handleResendOtp}
          disabled={loading || timeLeft > 0}
          className={`text-blue-600 font-semibold ${timeLeft > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
}
