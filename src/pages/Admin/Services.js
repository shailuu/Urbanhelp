import React, { useEffect, useState } from 'react';
import {
  getServices,
  createService,
  updateService,
  deleteService
} from '../../Services/api';
import './Admin.css';
import './Users.css'; // Reusing styles

const Services = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    additionalDetails: '',
    durations: [{ duration: '', charge: '' }],
  });

  const columns = [
    { key: 'title', title: 'Title' },
    { key: 'description', title: 'Description' },
    { key: 'image', title: 'Image URL' },
    { key: 'additionalDetails', title: 'Additional Details' },
    { key: 'durations', title: 'Durations & Charges' },
  ];

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (id) => setEditServiceId(id);
  const handleCancel = () => setEditServiceId(null);

  const handleChange = (e, id) => {
    const { name, value } = e.target;
    setServices(services.map(service =>
      service._id === id ? { ...service, [name]: value } : service
    ));
  };

  const handleSave = async (id) => {
    try {
      const updatedService = services.find(service => service._id === id);
      await updateService(id, updatedService);
      setEditServiceId(null);
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        setServices(services.filter(service => service._id !== id));
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDurationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDurations = [...formData.durations];
    updatedDurations[index][name] = value;
    setFormData({ ...formData, durations: updatedDurations });
  };

  const addDurationField = () => {
    setFormData({ ...formData, durations: [...formData.durations, { duration: '', charge: '' }] });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const newService = await createService(formData);
      setServices([...services, newService]);
      setFormData({
        title: '',
        description: '',
        image: '',
        additionalDetails: '',
        durations: [{ duration: '', charge: '' }],
      });
      setIsCreateFormVisible(false);
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 className="page-title">Services</h1>
        <button className="btn btn-primary" onClick={() => setIsCreateFormVisible(!isCreateFormVisible)}>
          {isCreateFormVisible ? 'Close Form' : 'Create New Service'}
        </button>
      </div>

      {isCreateFormVisible && (
        <form className="create-form" onSubmit={handleCreateSubmit}>
          {['title', 'description', 'image', 'additionalDetails'].map((field) => (
            <div className="form-group" key={field}>
              <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type="text"
                id={field}
                name={field}
                className="form-control"
                value={formData[field]}
                onChange={handleFormChange}
                required={field !== 'additionalDetails'}
              />
            </div>
          ))}

          <label>Durations</label>
          {formData.durations.map((item, index) => (
            <div className="form-group" key={index} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                name="duration"
                placeholder="Duration"
                value={item.duration}
                onChange={(e) => handleDurationChange(index, e)}
                className="form-control"
                required
              />
              <input
                type="number"
                name="charge"
                placeholder="Charge"
                value={item.charge}
                onChange={(e) => handleDurationChange(index, e)}
                className="form-control"
                required
              />
            </div>
          ))}
          <button type="button" className="btn btn-secondary btn-sm" onClick={addDurationField}>Add More</button>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">Submit</button>
          </div>
        </form>
      )}

      <table className="table">
        <thead>
          <tr>
            {columns.map(col => <th key={col.key}>{col.title}</th>)}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service._id}>
              {columns.map(col => (
                <td key={col.key}>
                  {editServiceId === service._id ? (
                    <input
                      type="text"
                      name={col.key}
                      value={service[col.key]}
                      onChange={(e) => handleChange(e, service._id)}
                      className="form-control inline-edit-input"
                    />
                  ) : col.key === 'durations' ? (
                    // Ensure durations is an array before mapping
                    Array.isArray(service[col.key]) && service[col.key].length > 0 ? (
                      service[col.key].map((item, index) => (
                        <div key={index}>
                          {`${item.duration} - $${item.charge}`}
                        </div>
                      ))
                    ) : (
                      <span>No durations available</span>
                    )
                  ) : (
                    service[col.key]
                  )}
                </td>
              ))}
              <td>
                {editServiceId === service._id ? (
                  <>
                    <button onClick={() => handleSave(service._id)} className="btn btn-primary btn-sm">Save</button>
                    <button onClick={handleCancel} className="btn btn-secondary btn-sm ml-2">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(service._id)} className="btn btn-warning btn-sm">Edit</button>
                    <button onClick={() => handleDelete(service._id)} className="btn btn-danger btn-sm ml-2">Delete</button>
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

export default Services;