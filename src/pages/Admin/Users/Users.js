import React, { useState, useEffect } from 'react';
import AdminDataTable from '../../../Components/admin/AdminDataTable/AdminDataTable';
import { getUsers } from '../../../services/adminService';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const columns = [
    { header: 'ID', accessor: '_id' },
    { header: 'Username', accessor: 'username' },
    { header: 'Email', accessor: 'email' },
    { header: 'Admin', accessor: 'isAdmin', format: (value) => value ? 'Yes' : 'No' },
    { header: 'Actions', accessor: '_id', isAction: true }
  ];

  const handleEdit = (userId) => {
    console.log('Edit user:', userId);
    // Implement edit functionality
  };

  const handleDelete = (userId) => {
    console.log('Delete user:', userId);
    // Implement delete functionality
  };

  return (
    <div className="users-page">
      <h1 className="page-title">User Management</h1>
      
      <div className="users-actions">
        <button className="btn btn-primary">Add New User</button>
      </div>
      
      <AdminDataTable 
        columns={columns}
        data={users}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Users;