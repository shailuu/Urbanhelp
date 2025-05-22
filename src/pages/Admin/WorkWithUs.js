import React, { useState, useEffect } from 'react';
import {
  getWorkWithUs,
  updateWorkWithUs,
  deleteWorkWithUs,
  approveWorker // This import might not be directly used if you're using fetch, but keeping it for context
} from '../../Services/api';
import './Admin.css';
import './Users.css';

const WorkWithUs = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editApplicationId, setEditApplicationId] = useState(null);

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
      // Filter out applications that are 'Approved' before setting state
      const pendingApplications = data.filter(app => app.status !== 'Approved');
      setApplications(pendingApplications);
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
      // Re-fetch applications to ensure the list is up-to-date after saving
      fetchApplications();
      setEditApplicationId(null);
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const handleCancel = () => {
    setEditApplicationId(null);
    // Re-fetch to discard any unsaved local changes
    fetchApplications();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteWorkWithUs(id);
        // After deletion, re-fetch applications to get the updated list
        fetchApplications();
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

      // Instead of updating local state, re-fetch all applications.
      // fetchApplications will then filter out the newly approved one.
      await fetchApplications();
      alert('Worker approved successfully.');
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

  // Helper to render table cell content
  const renderCell = (application, column) => {
    if (column.key === 'createdAt') {
      return new Date(application[column.key]).toLocaleDateString();
    }
    return application[column.key];
  };

  if (isLoading) {
    return <div className="loading-state">Loading applications...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Work With Us Applications</h1>
      </div>

      {applications.length === 0 ? (
        <p className="empty-state">No pending applications found.</p>
      ) : (
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
                      renderCell(application, column)
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
                      {application.status !== 'Approved' && ( // Only show approve action if not already approved
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
                            marginLeft: '8px', /* Added margin for spacing */
                          }}
                        >
                          <option value="" disabled>Select Action</option>
                          <option value="approve" style={{ color: 'green' }}>Approve</option>
                          
                        </select>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WorkWithUs;
