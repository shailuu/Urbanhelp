import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Layout.css'; // Import the layout-specific styles

const Sidebar = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user information from localStorage or sessionStorage
    const getUserInfo = () => {
      // Check various storage options where user info might be stored
      const userInfo = JSON.parse(localStorage.getItem('userInfo')) ||
                       JSON.parse(sessionStorage.getItem('userInfo')) ||
                       JSON.parse(localStorage.getItem('user')) ||
                       JSON.parse(sessionStorage.getItem('user')) || {};

      // Set user name - handle different possible object structures
      if (userInfo) {
        // Try different possible properties where name might be stored
        const name = userInfo.name || userInfo.fullName || userInfo.displayName ||
                     userInfo.username || userInfo.email || 'Admin';
        setUserName(name);
      }
    };

    getUserInfo();
  }, []);

  const handleLogout = () => {
    // Implement logout logic here, such as clearing session storage or cookies
    console.log("Logging out...");

    // Clear both localStorage and sessionStorage to be thorough
    localStorage.clear(); // Clear all localStorage items
    sessionStorage.clear(); // Clear all sessionStorage items

    // Clear specific authentication tokens if needed
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Clear cookies

    // Redirect user to the main homepage after logout
    window.location.href = '/'; // This should go to the main homepage, not user profile
  };

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-header">Admin Panel</div>
        <div className="user-info">
          <div className="user-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="user-name">
            Welcome, {userName}
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/admin" end className="sidebar-item">
          <i className="fas fa-tachometer-alt sidebar-icon"></i>
          Dashboard
        </NavLink>
        <NavLink to="/admin/users" className="sidebar-item">
          <i className="fas fa-users sidebar-icon"></i>
          Users
        </NavLink>
        <NavLink to="/admin/contacts" className="sidebar-item">
          <i className="fas fa-address-book sidebar-icon"></i>
          Contacts
        </NavLink>
        <NavLink to="/admin/workwithus" className="sidebar-item">
          <i className="fas fa-briefcase sidebar-icon"></i>
          Work With Us
        </NavLink>
        <NavLink to="/admin/approvedworkers" className="sidebar-item">
          <i className="fas fa-user-check sidebar-icon"></i>
          Approved Workers
        </NavLink>
        <NavLink to="/admin/services" className="sidebar-item">
          <i className="fas fa-concierge-bell sidebar-icon"></i>
          Services
        </NavLink>
        <NavLink to="/admin/bookings" className="sidebar-item">
          <i className="fas fa-calendar-alt sidebar-icon"></i>
          Bookings
        </NavLink>
        <NavLink to="/admin/approvedbookings" className="sidebar-item">
          <i className="fas fa-check-circle sidebar-icon"></i>
          Approved Bookings
        </NavLink>
        <NavLink to="/admin/reviews" className="sidebar-item">
          <i className="fas fa-star sidebar-icon"></i>
          Reviews
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt sidebar-icon"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;