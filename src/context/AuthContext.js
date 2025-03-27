import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token"); // Check if token exists
  });
  const [user, setUser] = useState(null); // Initialize user as null
  const [loading, setLoading] = useState(true); // Add loading state for user data fetching

  // Fetch user profile data from the backend
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile.");
      }

      const userData = await response.json();
      setUser(userData); // Store user data in state
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

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

  // Fetch user profile on component mount or when authentication changes
  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};