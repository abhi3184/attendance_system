import httpClient from "./httpClient";

export const getAccessToken = () => localStorage.getItem("token");
export const setAccessToken = (token) => localStorage.setItem("token", token);
export const setRefreshToken = (token) => localStorage.setItem("refresh_token", token);
export const setUser = (user) => localStorage.setItem("employee", user ? JSON.stringify(user) : null);

export const clearTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("employee");
};

// Refresh token logic using Axios (not fetch)
export const refreshAccessToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) throw new Error("No refresh token");

  try {
    const response = await httpClient.post("/auth/refresh", { refresh_token });
    if (!response.data?.access_token) throw new Error("Failed to refresh token");
    setAccessToken(response.data.access_token);
    return response.data.access_token;
  } catch (err) {
    console.error("Token refresh failed:", err);
    throw err; // important: throw to trigger global handler
  }
};
