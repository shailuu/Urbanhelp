import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { getAdminStats } from '../../../services/adminService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    services: 0,
    bookings: 0,
    applications: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Dashboard Overview</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-value">{stats.users}</p>
        </div>
        
        <div className="stat-card">
          <h3>Services</h3>
          <p className="stat-value">{stats.services}</p>
        </div>
        
        <div className="stat-card">
          <h3>Bookings</h3>
          <p className="stat-value">{stats.bookings}</p>
        </div>
        
        <div className="stat-card">
          <h3>Applications</h3>
          <p className="stat-value">{stats.applications}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;