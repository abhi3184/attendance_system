import { useState } from "react";
import * as authService from "../api/authServcie";
import { toast } from "react-toastify";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Check if email exists
  const checkUserEmail = async (email) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.checkEmail(email);
      setLoading(false);
      return res.data.data; // user object
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.detail || err.message || "Email check failed";
      setError(msg);
      toast.error(msg);
      throw new Error(msg);
    }
  };

  // Step 2: Login
  const login = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.login(email, password);
      setLoading(false);
      return res.data; // { user, token }
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.detail || err.response?.data?.message || err.message || "Login failed";
      setError(msg);
      toast.error(msg);
      throw new Error(msg);
    }
  };

  return { loading, error, checkUserEmail, login };
};
