import axios from "axios";
import { handleApiError } from "./errorHandler";
import { getAccessToken, refreshAccessToken, setAccessToken } from "./tokenService";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});


httpClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        console.warn("Token refresh failed:", refreshError);
      }
    }

    return handleApiError(error);
  }
);

export default httpClient;
