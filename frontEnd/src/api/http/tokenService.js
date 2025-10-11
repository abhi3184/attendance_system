export const getAccessToken = () => localStorage.getItem("token");
export const setAccessToken = (token) => localStorage.setItem("token", token);
export const setRefreshToken = (token) => localStorage.setItem("refresh_token", token);
export const setUser = (user) => localStorage.setItem("employee", user ? JSON.stringify(user) : null);

export const clearTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("employee");
};

// Refresh token logic
export const refreshAccessToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) throw new Error("No refresh token");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: refresh_token }),
  });
  if (!response.ok) throw new Error("Failed to refresh token");

  const data = await response.json();
  setAccessToken(data.refresh_token);
  return data.accessToken;
};
