import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const isAuthenticated = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Redirect to error page if admin-only route is accessed by a non-admin
  if (adminOnly && !user?.isAdmin) {
    return <Navigate to="/error" replace />;
  }

  return children;
};

export default ProtectedRoute;