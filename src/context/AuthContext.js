import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login function
  const login = () => {
    setIsAuthenticated(true);
    console.log("User logged in. isAuthenticated:", true);
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    console.log("User logged out. isAuthenticated:", false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};