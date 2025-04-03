import React, { useState, useEffect } from 'react';
import { getUsers, getContacts, getWorkWithUs } from '../../Services/api';
import "./Admin.css";
import Sidebar from '../../Components/Admin/Sidebar'; 

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    contacts: 0,
    workWithUs: 0,
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, contacts, workWithUs] = await Promise.all([
          getUsers(),
          getContacts(),
          getWorkWithUs(),
        ]);
        
        setStats({
          users: users.length,
          contacts: contacts.length,
          workWithUs: workWithUs.length,
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
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="content">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
        </div>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-title">Total Users</div>
            <div className="stat-value">{stats.users}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-title">Contact Requests</div>
            <div className="stat-value">{stats.contacts}</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-title">Work With Us Applications</div>
            <div className="stat-value">{stats.workWithUs}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
