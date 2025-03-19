// context/AuthContext.js

import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Add state for user-specific data

  // Login function
  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData); // Store user-specific data
    console.log("User logged in. isAuthenticated:", true, "User:", userData);
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null); // Clear user-specific data
    console.log("User logged out. isAuthenticated:", false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};