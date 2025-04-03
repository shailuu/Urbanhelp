import React from 'react';
import { NavLink } from 'react-router-dom';
import './Layout.css'; // Import the layout-specific styles

const Sidebar = () => {
  const handleLogout = () => {
    // Implement logout logic here, such as clearing session storage or cookies
    console.log("Logging out...");
    // For example: localStorage.clear(); or sessionStorage.clear();
    // Redirect user to login page after logout
    window.location.href = '/'; // Adjust as per your routing setup
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">Admin Panel</div>
      <nav className="sidebar-nav">
        <NavLink to="/admin" end className="sidebar-item">
          Dashboard
        </NavLink>
        <NavLink to="/admin/users" className="sidebar-item">
          Users
        </NavLink>
        <NavLink to="/admin/contacts" className="sidebar-item">
          Contacts
        </NavLink>
        <NavLink to="/admin/workwithus" className="sidebar-item">
          Work With Us
        </NavLink>
      </nav>
      <button className="sidebar-logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
