import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token"); // Check if token exists
  });
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null; // Parse stored user data
  });

  // Login function
  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData); // Store user-specific data
    localStorage.setItem("token", userData.token); // Save token to localStorage
    localStorage.setItem("user", JSON.stringify(userData)); // Save user data
    console.log("User logged in. isAuthenticated:", true, "User:", userData);
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null); // Clear user-specific data
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.removeItem("user"); // Remove user data
    console.log("User logged out. isAuthenticated:", false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};