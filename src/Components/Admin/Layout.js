import React from 'react';
import Sidebar from './Sidebar';
import '../../pages/Admin/Admin.css';

const Layout = ({ children }) => {
  return (
    <div className="layout-wrapper">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;