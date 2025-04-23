import React, { useState, useEffect } from 'react';
import {
  getUsers,
  getContacts,
  getWorkWithUs,
  getServices,
  getApprovedWorkers,
  getAllBookings,
  getApprovedBookings,
} from '../../Services/api';
import "./Admin.css";
import Sidebar from '../../Components/Admin/Sidebar';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    contacts: 0,
    workWithUs: 0,
    services: 0,
    approvedWorkers: 0,
    bookings: 0,
    approvedBookings: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all required data in parallel
        const [
          users,
          contacts,
          workWithUs,
          services,
          approvedWorkers,
          bookings,
          approvedBookings,
        ] = await Promise.all([
          getUsers(),
          getContacts(),
          getWorkWithUs(),
          getServices(),
          getApprovedWorkers(),
          getAllBookings(),
          getApprovedBookings(),
        ]);

        // Update stats state with fetched data
        setStats({
          users: users.length,
          contacts: contacts.length,
          workWithUs: workWithUs.length,
          services: services.length,
          approvedWorkers: approvedWorkers.length,
          bookings: bookings.length,
          approvedBookings: approvedBookings.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <p className="dashboard-subtitle">Welcome to your admin dashboard</p>
        </div>

        <div className="stats-container">
          <div className="stats-row">
            <div className="stat-card users">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3 className="stat-value">{stats.users}</h3>
                <p className="stat-label">Total Users</p>
              </div>
            </div>

            <div className="stat-card contacts">
              <div className="stat-icon">✉️</div>
              <div className="stat-info">
                <h3 className="stat-value">{stats.contacts}</h3>
                <p className="stat-label">Contact Requests</p>
              </div>
            </div>

            <div className="stat-card applications">
              <div className="stat-icon">📝</div>
              <div className="stat-info">
                <h3 className="stat-value">{stats.workWithUs}</h3>
                <p className="stat-label">Work Applications</p>
              </div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card services">
              <div className="stat-icon">🛠️</div>
              <div className="stat-info">
                <h3 className="stat-value">{stats.services}</h3>
                <p className="stat-label">Total Services</p>
              </div>
            </div>

            <div className="stat-card workers">
              <div className="stat-icon">👷</div>
              <div className="stat-info">
                <h3 className="stat-value">{stats.approvedWorkers}</h3>
                <p className="stat-label">Approved Workers</p>
              </div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card bookings">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <h3 className="stat-value">{stats.bookings}</h3>
                <p className="stat-label">Total Bookings</p>
              </div>
            </div>

            <div className="stat-card approved">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3 className="stat-value">{stats.approvedBookings}</h3>
                <p className="stat-label">Approved Bookings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;