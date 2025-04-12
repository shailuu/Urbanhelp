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
  // New state to properly handle editing service durations
  const [editingService, setEditingService] = useState(null);

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

  const handleEdit = (id) => {
    const serviceToEdit = services.find(service => service._id === id);
    // Create a deep copy to avoid direct state mutation
    setEditingService(JSON.parse(JSON.stringify(serviceToEdit)));
    setEditServiceId(id);
  };
  
  const handleCancel = () => {
    setEditServiceId(null);
    setEditingService(null);
  };

  const handleChange = (e, field) => {
    const { name, value } = e.target;
    setEditingService(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle duration changes when editing
  const handleEditDurationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDurations = [...editingService.durations];
    updatedDurations[index][name] = value;
    setEditingService({
      ...editingService,
      durations: updatedDurations
    });
  };

  // Add a duration field when editing
  const handleAddEditDuration = () => {
    setEditingService({
      ...editingService,
      durations: [...editingService.durations, { duration: '', charge: '' }]
    });
  };

  // Remove a duration field when editing
  const handleRemoveEditDuration = (index) => {
    if (editingService.durations.length > 1) {
      const updatedDurations = [...editingService.durations];
      updatedDurations.splice(index, 1);
      setEditingService({
        ...editingService,
        durations: updatedDurations
      });
    }
  };

  const handleSave = async (id) => {
    try {
      await updateService(id, editingService);
      setServices(services.map(service =>
        service._id === id ? editingService : service
      ));
      setEditServiceId(null);
      setEditingService(null);
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

  const removeDurationField = (index) => {
    if (formData.durations.length > 1) {
      const updatedDurations = [...formData.durations];
      updatedDurations.splice(index, 1);
      setFormData({ ...formData, durations: updatedDurations });
    }
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

          <div className="form-group">
            <label>Durations and Pricing</label>
            <div className="durations-container">
              {formData.durations.map((item, index) => (
                <div className="duration-row" key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                  <input
                    type="text"
                    name="duration"
                    placeholder="Duration (e.g., 30 min, 1 hour)"
                    value={item.duration}
                    onChange={(e) => handleDurationChange(index, e)}
                    className="form-control"
                    style={{ flex: 1 }}
                    required
                  />
                  <input
                    type="number"
                    name="charge"
                    placeholder="Price ($)"
                    value={item.charge}
                    onChange={(e) => handleDurationChange(index, e)}
                    className="form-control"
                    style={{ flex: 1 }}
                    required
                  />
                  {formData.durations.length > 1 && (
                    <button 
                      type="button" 
                      className="btn btn-danger btn-sm"
                      onClick={() => removeDurationField(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={addDurationField}
                style={{ marginTop: '10px' }}
              >
                Add Duration Option
              </button>
            </div>
          </div>

          <div className="form-actions" style={{ marginTop: '20px' }}>
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
                    col.key === 'durations' ? (
                      <div className="edit-durations">
                        {editingService.durations.map((item, index) => (
                          <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                            <input
                              type="text"
                              name="duration"
                              placeholder="Duration"
                              value={item.duration}
                              onChange={(e) => handleEditDurationChange(index, e)}
                              className="form-control"
                              style={{ width: '120px' }}
                            />
                            <input
                              type="number"
                              name="charge"
                              placeholder="Price"
                              value={item.charge}
                              onChange={(e) => handleEditDurationChange(index, e)}
                              className="form-control"
                              style={{ width: '80px' }}
                            />
                            {editingService.durations.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => handleRemoveEditDuration(index)}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={handleAddEditDuration}
                        >
                          + Add Option
                        </button>
                      </div>
                    ) : (
                      <input
                        type="text"
                        name={col.key}
                        value={editingService[col.key]}
                        onChange={handleChange}
                        className="form-control inline-edit-input"
                      />
                    )
                  ) : col.key === 'durations' ? (
                    // Ensure durations is an array before mapping
                    Array.isArray(service[col.key]) && service[col.key].length > 0 ? (
                      <div>
                        {service[col.key].map((item, index) => (
                          <div key={index} style={{ marginBottom: '4px' }}>
                            <span style={{ fontWeight: 'bold' }}>{item.duration}</span> - <span style={{ color: '#0d6efd' }}>${item.charge}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#6c757d' }}>No durations available</span>
                    )
                  ) : (
                    service[col.key]
                  )}
                </td>
              ))}
              <td style={{ whiteSpace: 'nowrap' }}>
                {editServiceId === service._id ? (
                  <>
                    <button onClick={() => handleSave(service._id)} className="btn btn-primary btn-sm">Save</button>
                    <button onClick={handleCancel} className="btn btn-secondary btn-sm" style={{ marginLeft: '8px' }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(service._id)} className="btn btn-warning btn-sm">Edit</button>
                    <button onClick={() => handleDelete(service._id)} className="btn btn-danger btn-sm" style={{ marginLeft: '8px' }}>Delete</button>
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