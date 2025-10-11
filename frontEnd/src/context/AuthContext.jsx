import React, { createContext, useState, useEffect } from "react";
import { getAccessToken, clearTokens } from "../api/http/tokenService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getAccessToken();
    if (token) setUser({});
  }, []);

  const logout = () => {
    clearTokens();
    setUser(null);
    // window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
