import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import "./Login.css";
import { getUserRole } from "../utils/JWTHelper";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Email submit
  const handleUsernameSubmit = async () => {
    if (!username.trim()) {
      setUsernameError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      setUsernameError("Invalid email");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/auth/getEmployeeByEmail`,
        { params: { email: username } }
      );
      setLoading(false);

      if (response.data.success && response.data.data) {
        setStep(2);
        setUser(response.data.data);
        setUsernameError("");
      } else {
        toast.error("Email does not exist");
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast.error("Error checking email");
    }
  };

  // Step 2: Password validation
  const validatePassword = () => {
    if (!password.trim()) {
      setPasswordError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Step 2: Login submit
  const handleLoginSubmit = async () => {
    if (!validatePassword()) return;

    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:8000/auth/login", {
        login: username,
        password: password,
      });
      setLoading(false);

      const data = response.data;
      if (data.success && data.employee) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("employee", JSON.stringify(data.employee));
        setUser(data.employee);

        const roles = getUserRole(data.access_token);
        if (roles === "Manager") navigate("/dashboard/mhome");
        else if (roles === "Hr") navigate("/dashboard/hrdashboard");
        else navigate("/dashboard/home");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast.error(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="login-page flex min-h-screen">
      <div className="login-left w-1/2 bg-blue-600 hidden md:block"></div>
      <div className="login-right w-full md:w-1/2 flex justify-center items-center p-6">
        <motion.div
          className="login-form w-full max-w-md p-8 bg-white rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6">Login</h2>

          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleUsernameSubmit(); }}>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="text"
                value={username}
                style={{ marginBottom: "3px" }}
                onChange={(e) => {
                  const value = e.target.value;
                  setUsername(value);

                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!value.trim()) setUsernameError("Email is required");
                  else if (!emailRegex.test(value)) setUsernameError("Invalid email");
                  else setUsernameError("");
                }}
                className={`border rounded px-3 py-2 w-full ${usernameError ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Enter your email"
              />
              {usernameError && (
                <span className="text-red-500 text-sm font-semibold">{usernameError}</span>
              )}
              <button
                type="submit"
                onClick={handleUsernameSubmit}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded"
                disabled={loading}
              >
                {loading ? "Checking..." : "Next"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); handleLoginSubmit(); }}>
              <p className="mb-4">Hello, <strong>{username}</strong></p>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                value={password}
                style={{ marginBottom: "3px" }}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                className={`border rounded px-3 py-2 w-full ${passwordError ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Enter password"
              />
              {passwordError && (
                <span className="text-red-500 text-sm font-semibold">{passwordError}</span>
              )}
              <button
                type="submit"
                onClick={handleLoginSubmit}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <p
                className="text-blue-600 cursor-pointer mt-2 text-sm"
                onClick={() => navigate("/forget-pass", { state: { email: username } })}
              >
                Forgot Password?
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
