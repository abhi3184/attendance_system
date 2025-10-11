import axios from "axios";
import { handleApiError } from "./errorHandler";
import { getAccessToken, refreshAccessToken, setAccessToken, clearTokens } from "./tokenService";
import { toast } from "react-toastify";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Request interceptor to attach access token
httpClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh queue to avoid multiple simultaneous refreshes
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Response interceptor to handle 401 + refresh
httpClient.interceptors.response.use(

  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return handleApiError(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            };
            return httpClient(originalRequest);
          })
          .catch((err) => handleApiError(err));
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        if (!newToken) throw new Error("Refresh failed");
        setAccessToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return httpClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        // toast.error("Session expired. Please login again.", { autoClose: 3000 });
        setTimeout(() => (window.location.href = "/login"), 3000);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return handleApiError(error);
  }
);

export default httpClient;
