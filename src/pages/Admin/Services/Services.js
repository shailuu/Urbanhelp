import React, { useState, useEffect } from 'react';
import AdminDataTable from '../../../Components/admin/AdminDataTable/AdminDataTable';
import { getServices } from '../../../services/adminService';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const columns = [
    { header: 'ID', accessor: '_id' },
    { header: 'Title', accessor: 'title' },
    { header: 'Description', accessor: 'description' },
    { header: 'Actions', accessor: '_id', isAction: true }
  ];

  const handleEdit = (serviceId) => {
    console.log('Edit service:', serviceId);
    // Implement edit functionality
  };

  const handleDelete = (serviceId) => {
    console.log('Delete service:', serviceId);
    // Implement delete functionality
  };

  return (
    <div className="services-page">
      <h1 className="page-title">Service Management</h1>
      
      <div className="services-actions">
        <button className="btn btn-primary">Add New Service</button>
      </div>
      
      <AdminDataTable 
        columns={columns}
        data={services}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Services;