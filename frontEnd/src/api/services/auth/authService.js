import httpClient from "../../http/httpClient";
import { setAccessToken, setUser } from "../../http/tokenService";

export const login = async (credentials) => {
  const response = await httpClient.post("/auth/login", credentials);
  const { access_token, refreshToken, employee } = response.data;
  
  localStorage.setItem("refreshToken", refreshToken);
  setAccessToken(access_token);
  setUser(employee);
  return { employee, access_token };
};

export const getEmployeeByEmail = async (email) => {
  try {
    const response = await httpClient.get("/auth/getEmployeeByEmail", {
      params: { email },
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error("Email does not exist");
    }
  } catch (error) {
    throw error;
  }
};



export const logout = () => {
  localStorage.clear();
};
