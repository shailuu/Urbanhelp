import React, { useState, useEffect } from 'react';
import {
  getWorkWithUs,
  createWorkWithUs,
  updateWorkWithUs,
  deleteWorkWithUs,
  approveWorker
} from '../../Services/api';
import './Admin.css';
import './Users.css';

const WorkWithUs = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [editApplicationId, setEditApplicationId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    skills: '',
    experience: '',
    status: 'new',
  });

  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'phone', title: 'Phone' },
    { key: 'service', title: 'Service' },
    { key: 'status', title: 'Status' },
    { key: 'createdAt', title: 'Date' },
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const data = await getWorkWithUs();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (applicationId) => {
    setEditApplicationId(applicationId);
  };

  const handleSave = async (applicationId) => {
    try {
      const updatedApplication = applications.find(app => app._id === applicationId);
      await updateWorkWithUs(applicationId, updatedApplication);
      setApplications(applications.map(app =>
        app._id === applicationId ? updatedApplication : app
      ));
      setEditApplicationId(null);
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const handleCancel = () => {
    setEditApplicationId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteWorkWithUs(id);
        setApplications(applications.filter(app => app._id !== id));
      } catch (error) {
        console.error('Error deleting application:', error);
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/admin/workwithus/${id}/approve`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Approval failed');
      }
  
      // Update the local state to show 'approved'
      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: 'Approved' } : app
        )
      );
    } catch (error) {
      console.error('Error approving application:', error.message);
      alert('Failed to approve worker');
    }
  };
  

  const handleChange = (e, applicationId) => {
    const { name, value } = e.target;
    setApplications(applications.map(app =>
      app._id === applicationId ? { ...app, [name]: value } : app
    ));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const newApplication = await createWorkWithUs(formData);
      setApplications([...applications, newApplication]);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        skills: '',
        experience: '',
        status: 'new',
      });
      setIsCreateFormVisible(false);
    } catch (error) {
      console.error('Error creating application:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 className="page-title">Work With Us Applications</h1>
        <button className="btn btn-primary" onClick={() => setIsCreateFormVisible(!isCreateFormVisible)}>
          {isCreateFormVisible ? 'Close Form' : 'Create New Application'}
        </button>
      </div>

      {isCreateFormVisible && (
        <form className="create-form" onSubmit={handleCreateSubmit}>
          {['name', 'email', 'phone', 'service', 'skills', 'experience'].map((field) => (
            <div className="form-group" key={field}>
              <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type="text"
                id={field}
                name={field}
                className="form-control"
                value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                required
              />
            </div>
          ))}

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              className="form-control"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
            >
              <option value="new">New</option>
              <option value="under-review">Under Review</option>
              <option value="interview">Interview</option>
              <option value="rejected">Rejected</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">Submit</button>
          </div>
        </form>
      )}

      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.title}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application._id}>
              {columns.map((column) => (
                <td key={column.key}>
                  {editApplicationId === application._id ? (
                    <input
                      type="text"
                      name={column.key}
                      value={application[column.key]}
                      onChange={(e) => handleChange(e, application._id)}
                      className="form-control inline-edit-input"
                    />
                  ) : (
                    application[column.key]
                  )}
                </td>
              ))}
              <td>
                {editApplicationId === application._id ? (
                  <>
                    <button onClick={() => handleSave(application._id)} className="btn btn-primary btn-sm">Save</button>
                    <button onClick={handleCancel} className="btn btn-secondary btn-sm ml-2">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(application._id)} className="btn btn-warning btn-sm">Edit</button>
                    <button onClick={() => handleDelete(application._id)} className="btn btn-danger btn-sm ml-2">Delete</button>
                    <select
  defaultValue=""
  onChange={(e) => {
    const value = e.target.value;
    if (value === "approve") {
      handleApprove(application._id);
    }
  }}
  style={{
    padding: '5px 10px',
    borderRadius: '4px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: '1px solid #ccc',
  }}
>
  <option value="" disabled>Select Action</option>
  <option value="approve" style={{ color: 'green' }}>Approve</option>
  <option value="disapprove" style={{ color: 'red' }}>Disapprove</option>
</select>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkWithUs;
