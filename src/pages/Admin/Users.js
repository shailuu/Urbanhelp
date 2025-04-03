import React, { useState, useEffect } from 'react';
import { getUsers, updateUser, deleteUser, createUser } from '../../Services/api'; // Adjusted path
import DataTable from '../../Components/Admin/Datatable'; // Adjusted path
import "./Admin.css";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({});
  const [newUserForm, setNewUserForm] = useState({
    username: '',
    email: '',
    address: '',
    city: '',
    dob: '',
    gender: '',
    phoneNumber: '',
  }); // Store new user data

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
      console.log("Fetched users data:", data);
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

  const handleChange = (e, userId) => {
    const { name, value } = e.target;
    if (userId) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setNewUserForm((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSave = async (userId) => {
    try {
      console.log("Updating user with ID:", userId);
      console.log("Form Data:", formData);
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

  const handleCreateUser = async () => {
    try {
      const newUser = await createUser(newUserForm); // Assuming createUser API function
      setUsers([newUser, ...users]);
      setNewUserForm({
        username: '',
        email: '',
        address: '',
        city: '',
        dob: '',
        gender: '',
        phoneNumber: '',
      }); // Reset the form after submission
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Users</h1>
      </div>

      <div className="create-user-form">
        <h3>Create New User</h3>
        <form>
          <input
            type="text"
            name="username"
            value={newUserForm.username}
            onChange={(e) => handleChange(e)}
            placeholder="Username"
            required
          />
          <input
            type="email"
            name="email"
            value={newUserForm.email}
            onChange={(e) => handleChange(e)}
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="address"
            value={newUserForm.address}
            onChange={(e) => handleChange(e)}
            placeholder="Address"
            required
          />
          <input
            type="text"
            name="city"
            value={newUserForm.city}
            onChange={(e) => handleChange(e)}
            placeholder="City"
            required
          />
          <input
            type="date"
            name="dob"
            value={newUserForm.dob}
            onChange={(e) => handleChange(e)}
            required
          />
          <select
            name="gender"
            value={newUserForm.gender}
            onChange={(e) => handleChange(e)}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            name="phoneNumber"
            value={newUserForm.phoneNumber}
            onChange={(e) => handleChange(e)}
            placeholder="Phone Number"
            required
          />
          <button type="button" onClick={handleCreateUser}>
            Create User
          </button>
        </form>
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
              onChange={(e) => handleChange(e, user._id || user.id)}
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
              <button
                onClick={() => handleSave(user._id || user.id)}
                className="btn btn-primary btn-sm"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="btn btn-secondary btn-sm ml-2"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleEdit(user)}
                className="btn btn-warning btn-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user._id || user.id)}
                className="btn btn-danger btn-sm ml-2"
              >
                Delete
              </button>
            </>
          );
        }}
      />
    </div>
  );
};

export default Users;
