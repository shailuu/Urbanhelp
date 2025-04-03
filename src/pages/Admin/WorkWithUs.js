import React, { useState, useEffect } from 'react';
import { getWorkWithUs, updateWorkWithUs, deleteWorkWithUs } from '../../Services/api'; // Adjusted path
import DataTable from '../../Components/Admin/Datatable'; // Adjusted path
import Dialog from '../../Components/Admin/Dialog'; 

const WorkWithUs = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    skills: '',
    experience: '',
    status: '',
  });

  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'phone', title: 'Phone' },
    { key: 'service', title: 'Service' },
    { key: 'status', title: 'Status' },
    { key: 'createdAt', title: 'Date' },
  ];

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

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleEdit = (application) => {
    setCurrentApplication(application);
    setFormData({
      name: application.name,
      email: application.email,
      phone: application.phone,
      service: application.service,
      skills: application.skills,
      experience: application.experience,
      status: application.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteWorkWithUs(id);
        setApplications(applications.filter(app => app.id !== id));
      } catch (error) {
        console.error('Error deleting application:', error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateWorkWithUs(currentApplication._id, formData);
      setApplications(applications.map(app => 
        app._id === currentApplication._id ? { ...app, ...formData } : app
      ));
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Work With Us Applications</h1>
      </div>
      
      <DataTable 
        columns={columns} 
        data={applications} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Edit Application"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="service">Service</label>
            <input
              type="text"
              id="service"
              name="service"
              className="form-control"
              value={formData.service}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="skills">Skills</label>
            <input
              type="text"
              id="skills"
              name="skills"
              className="form-control"
              value={formData.skills}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience">Experience</label>
            <input
              type="text"
              id="experience"
              name="experience"
              className="form-control"
              value={formData.experience}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              className="form-control"
              value={formData.status}
              onChange={handleChange}
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
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default WorkWithUs;
