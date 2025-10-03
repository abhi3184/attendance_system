export const handleApiError = (error) => {
  if (!error.response) {
    alert("Network error! Check your connection.");
  } else {
    const { status, data } = error.response;
    switch (status) {
      case 400: alert(data.message || "Bad Request"); break;
      case 401: alert("Unauthorized! Login again."); break;
      case 403: alert("Forbidden! Access denied."); break;
      case 404: alert("Not found!"); break;
      case 500: alert("Server error! Try later."); break;
      default: alert(data.message || "Something went wrong!"); break;
    }
  }
};
