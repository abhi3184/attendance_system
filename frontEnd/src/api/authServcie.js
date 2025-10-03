import apiClient from "./apiClient";

export const checkEmail = (email) => apiClient.get("/auth/getEmployeeByEmail", {
      params: { email }  // sends ?email=xxx
});


export const login = (login, password) => apiClient.post("/auth/login", { login, password });
