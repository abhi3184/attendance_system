import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ForgotPassword from "./ForgetPassword";
import { useAuth } from "../hooks/useAuth";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./Login.css";
import { getUserRole } from "../utils/JWTHelper";

export default function Login() {
  const navigate = useNavigate();
  const { login, checkUserEmail, loading } = useAuth();
  const { setUser } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Email submit
  const handleUsernameSubmit = async () => {
    setUsernameError("");
    if (!username.trim()) return setUsernameError("Email is required");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) return setUsernameError("Invalid email");

    try {
      await checkUserEmail(username); // throws error if not exist
      setStep(2);
    } catch (err) {
      // error already shown via toast in hook
    }
  };

  // Password validation
  const validatePassword = () => {
    if (!password.trim()) return setPasswordError("Password is required"), false;
    if (password.length < 6) return setPasswordError("Password must be at least 6 characters"), false;
    setPasswordError("");
    return true;
  };

  // Login submit
  const handleLoginSubmit = async () => {
    if (!validatePassword()) return;
    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("employee", JSON.stringify(data.employee)); 
      const roles = getUserRole(data.access_token);
      if (roles === "Manager") {
        navigate("/dashboard/mhome");
      }else if(roles === "Hr"){
        navigate("/dashboard/hrhome");
      }else{
        navigate("/dashboard/home");
      }
    } catch (err) {
    }
  };

  return (
    <div className="login-page flex min-h-screen">
      <div className="login-left w-1/2 bg-blue-600 hidden md:block"></div>
      <div className="login-right w-full md:w-1/2 flex justify-center items-center p-6">
        {step === 3 ? (
          <ForgotPassword email={username} onBack={() => setStep(2)} />
        ) : (
          <motion.div
            className="login-form w-full max-w-md p-8 bg-white rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6">Sign In</h2>

            {step === 1 && (
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="text"
                  value={username}
                  style={{
                    marginBottom: '3px'
                  }}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`border rounded px-3 py-2 w-full ${usernameError ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter your email"
                />
                {usernameError && <span className="text-red-500 text-sm font-semibold">{usernameError}</span>}
                <button
                  onClick={handleUsernameSubmit}
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded"
                  disabled={loading}
                >
                  {loading ? "Checking..." : "Next"}
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="mb-4">Hello, <strong>{username}</strong></p>
                <label className="block mb-1 font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  style={{
                    marginBottom: '3px'
                  }}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError(""); // hide error as user types
                  }}
                  className={`border rounded px-3 py-2 w-full ${passwordError ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter password"
                />
                {passwordError && <span className="text-red-500 text-sm font-semibold">{passwordError}</span>}
                <button
                  onClick={handleLoginSubmit}
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
                <p className="text-blue-600 cursor-pointer mt-2 text-sm" onClick={() => setStep(3)}>
                  Forgot Password?
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
