import React from 'react';
import './AdminHeader.css';

const AdminHeader = () => {
  return (
    <header className="admin-header">
      <div className="header-content">
        <div className="header-left">
          <span className="welcome-text">Welcome, Admin</span>
        </div>
        <div className="header-right">
          <button className="logout-btn">Logout</button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;