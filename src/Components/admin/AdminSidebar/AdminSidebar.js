import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const menuItems = [
    { path: '/admin', icon: '📊', text: 'Dashboard' },
    { path: '/admin/users', icon: '👥', text: 'Users' },
    { path: '/admin/services', icon: '🛠️', text: 'Services' },
    { path: '/admin/bookings', icon: '📅', text: 'Bookings' },
    { path: '/admin/applications', icon: '📝', text: 'Applications' }
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>UrbanHelp Admin</h2>
      </div>
      <nav className="sidebar-menu">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => 
              `menu-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.text}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;