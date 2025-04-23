import React, { useState, useEffect } from 'react';
import { getUsers, updateUser, deleteUser } from '../../Services/api';
import DataTable from '../../Components/Admin/Datatable';
import "./Admin.css";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({});

  const columns = [
    { key: 'username', title: 'Username' },
    { key: 'email', title: 'Email' },
    { key: 'address', title: 'Address' },
    { key: 'city', title: 'City' },
    { key: 'dob', title: 'Date of Birth' },
    { key: 'gender', title: 'Gender' },
    { key: 'phoneNumber', title: 'Phone Number' },
  ];

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUserId(user._id || user.id);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      address: user.address || '',
      city: user.city || '',
      dob: user.dob || '',
      gender: user.gender || '',
      phoneNumber: user.phoneNumber || '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter((user) => (user._id || user.id) !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (userId) => {
    try {
      await updateUser(userId, formData);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          (user._id || user.id) === userId ? { ...user, ...formData } : user
        )
      );
      setEditingUserId(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCancel = () => {
    setEditingUserId(null);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Users</h1>
      </div>

      <DataTable
        columns={columns}
        data={users}
        renderCell={(column, user) => {
          const isEditing = editingUserId === (user._id || user.id);
          return isEditing ? (
            <input
              type="text"
              name={column.key}
              value={formData[column.key] || ''}
              onChange={handleChange}
              className="form-control inline-edit-input"
            />
          ) : (
            user[column.key]
          );
        }}
        renderActions={(user) => {
          const isEditing = editingUserId === (user._id || user.id);
          return isEditing ? (
            <>
              <button onClick={() => handleSave(user._id || user.id)} className="btn btn-primary btn-sm">Save</button>
              <button onClick={handleCancel} className="btn btn-secondary btn-sm ml-2">Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => handleEdit(user)} className="btn btn-warning btn-sm">Edit</button>
              <button onClick={() => handleDelete(user._id || user.id)} className="btn btn-danger btn-sm ml-2">Delete</button>
            </>
          );
        }}
      />
    </div>
  );
};

export default Users;
