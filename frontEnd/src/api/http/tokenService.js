export const getAccessToken = () => localStorage.getItem("token");
export const setAccessToken = (token) => localStorage.setItem("token", token);
export const setUser = (user) => localStorage.setItem("employee", user ? JSON.stringify(user) : null);

export const clearTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("employee");
};

// Refresh token logic
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: refreshToken }),
  });
  if (!response.ok) throw new Error("Failed to refresh token");

  const data = await response.json();
  setAccessToken(data.accessToken);
  return data.accessToken;
};
