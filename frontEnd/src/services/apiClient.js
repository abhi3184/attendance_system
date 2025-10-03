import axios from "axios";
import { toast } from "react-toastify";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // only if using cookies
});

// Request interceptor → attach token if exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → global error handling
apiClient.interceptors.response.use(
  (response) => response, // pass success
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      // Unauthorized → logout globally
      localStorage.removeItem("token");
      window.location.href = "/login"; 
    } else if (status === 403) {
      alert("Access denied");
    } else if (status >= 500) {
      alert("Server error, try again later");
    }else if (status === 404){
       toast.error(error.detail)
    }else if(status === 422){
       toast.error("Invalid format")

    }

    return Promise.reject(error); // allows component-level handling too
  }
);

export default apiClient;
