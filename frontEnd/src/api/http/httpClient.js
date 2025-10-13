// httpClient.js
import axios from "axios";
import { toast } from "react-toastify";
import { handleApiError } from "./errorHandler";
import {
  getAccessToken,
  refreshAccessToken,
  setAccessToken,
  clearTokens,
} from "./tokenService";
// Assumes you have some loader controller with show/hide (adapt names if different)
import { loaderController } from "../../context/loaderController";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// -----------------------------
// Global loader request counting
// -----------------------------
let activeRequests = 0;

const incrementRequestCount = (config) => {
  // Support skipping loader via config.ignoreLoader or header x-skip-loader
  const skip =
    (config && config.ignoreLoader) ||
    (config && config.headers && config.headers["x-skip-loader"]);
  if (skip) return;

  activeRequests += 1;
  // show loader only when first request starts
  if (activeRequests === 1) {
    // adapt these method names to your loaderController API if different
    if (loaderController && typeof loaderController.show === "function") {
      loaderController.show();
    } else if (
      loaderController &&
      typeof loaderController.start === "function"
    ) {
      loaderController.start();
    } else {
      // fallback: console log (replace with your UI trigger)
      console.log("Loader show (no loaderController.show found)");
    }
  }
};

const decrementRequestCount = (config) => {
  const skip =
    (config && config.ignoreLoader) ||
    (config && config.headers && config.headers["x-skip-loader"]);
  if (skip) return;

  activeRequests = Math.max(0, activeRequests - 1);
  if (activeRequests === 0) {
    if (loaderController && typeof loaderController.hide === "function") {
      loaderController.hide();
    } else if (
      loaderController &&
      typeof loaderController.stop === "function"
    ) {
      loaderController.stop();
    } else {
      console.log("Loader hide (no loaderController.hide found)");
    }
  }
};

// ===============================
// Request interceptor
// ===============================
httpClient.interceptors.request.use(
  (config) => {
    // Attach access token if present
    const token = getAccessToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // Increase global request counter (unless skipped)
    incrementRequestCount(config);

    return config;
  },
  (error) => {
    // if request creation fails, don't forget loader decrement
    decrementRequestCount(error?.config || {});
    return Promise.reject(error);
  }
);

// ===============================
// Refresh queue handling
// ===============================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ===============================
// Response interceptor
// ===============================
httpClient.interceptors.response.use(
  (response) => {
    // successful response -> decrement and return
    decrementRequestCount(response.config || {});
    return response;
  },
  async (error) => {
    const originalRequest = error.config || {};

    // always decrement for this failed request (unless it's skipped)
    decrementRequestCount(originalRequest);

    // No response (network error, timeout)
    if (!error.response) {
      toast.error("Network error! Check your internet connection.");
      console.error("Network error:", error);
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Handle 401 with refresh token logic
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If already refreshing, queue the request and return a promise
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            };
            // Important: when retrying, skip loader for the retried request to avoid flicker
            originalRequest.ignoreLoader = true;
            return httpClient(originalRequest);
          })
          .catch((err) => handleApiError(err));
      }

      isRefreshing = true;

      try {
        // NOTE: refreshAccessToken should use raw axios and set header x-skip-loader
        // so refresh request itself doesn't trigger loader increments.
        const newToken = await refreshAccessToken();
        if (!newToken) throw new Error("Failed to refresh token");

        setAccessToken(newToken);
        processQueue(null, newToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        // Skip loader when retrying the original request
        originalRequest.ignoreLoader = true;

        return httpClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();

        toast.error("Session expired. Please login again.", {
          autoClose: 3000,
        });

        setTimeout(() => (window.location.href = "/login"), 3000);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Other statuses -> pass to generic handler
    return handleApiError(error);
  }
);

export default httpClient;
