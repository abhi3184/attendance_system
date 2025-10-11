import toast from "react-hot-toast";

export const handleApiError = (error) => {
  if (!error.response) {
    toast.error("Network error! Check your connection.");
    console.error("Network error:", error);
    return Promise.reject(error);
  }

  const { status, data } = error.response;
  console.log("API Error Response:", error.response);

  switch (status) {
    case 400:
      toast.error(data?.detail || "Bad request",{ autoClose: 3000 });
      break;
    case 401:
      toast.error("Unauthorized! Please login again.",{ autoClose: 3000 });
      break;
    case 403:
      toast.error("Session expired! Please login again.", { autoClose: 3000 });
      break;
    case 404:
      toast.error("Not found",{ autoClose: 3000 });
      break;
    case 500:
      toast.error("Server error",{ autoClose: 3000 });
      break;
    default:
      toast.error(data?.detail || "Something went wrong");
  }

  return Promise.reject(error);
};
