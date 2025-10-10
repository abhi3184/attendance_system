// src/http/errorHandler.js
import { toast } from "react-toastify";
import { logError } from "../../utils/logger";

export const handleApiError = (error) => {
  if (!error.response) {
    toast.error("Network error! Check your connection.");
    logError(error, "Network error");
    return Promise.reject(error);
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      toast.error(data?.detail || "Bad request");
      break;
    case 401:
      toast.error("Unauthorized! Please login again.");
      localStorage.clear();
      window.location.href = "/login";
      break;
    case 403:
      toast.error("Forbidden");
      break;
    case 404:
      toast.error("Not found");
      break;
    case 500:
      toast.error("Server error");
      break;
    default:
      toast.error(data?.detail || "Something went wrong");
  }

  logError(error, "API error");
  return Promise.reject(error);
};
