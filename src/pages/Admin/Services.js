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
    additionalDetails: '',
    durations: [{ duration: '', charge: '' }],
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [editingService, setEditingService] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');

  const columns = [
    { key: 'title', title: 'Title' },
    { key: 'description', title: 'Description' },
    { key: 'image', title: 'Image' },
    { key: 'additionalDetails', title: 'Additional Details' },
    { key: 'durations', title: 'Durations & Charges' },
  ];

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await getServices();
      setServices(data.services);;
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      const response = await fetch("http://localhost:5001/api/services");
      const data = await response.json();
      setServices(data.services); // 👈 Make sure you're accessing the array
    };
  
    fetchServices();
  }, []);
  
  const handleEdit = (id) => {
    const serviceToEdit = services.find(service => service._id === id);
    setEditingService(JSON.parse(JSON.stringify(serviceToEdit)));
    setEditServiceId(id);
    setEditImagePreview(serviceToEdit.image);
  };
  
  const handleCancel = () => {
    setEditServiceId(null);
    setEditingService(null);
    setEditImageFile(null);
    setEditImagePreview('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingService(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditDurationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDurations = [...editingService.durations];
    updatedDurations[index][name] = value;
    setEditingService({
      ...editingService,
      durations: updatedDurations
    });
  };

  const handleAddEditDuration = () => {
    setEditingService({
      ...editingService,
      durations: [...editingService.durations, { duration: '', charge: '' }]
    });
  };

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
      const formData = new FormData();
      for (const key in editingService) {
        if (key === 'durations') {
          formData.append(key, JSON.stringify(editingService[key]));
        } else if (key !== 'image') {
          formData.append(key, editingService[key]);
        }
      }
      if (editImageFile) {
        formData.append('image', editImageFile);
      }

      await updateService(id, formData);
      fetchServices();
      handleCancel();
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
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
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('additionalDetails', formData.additionalDetails);
      formDataObj.append('durations', JSON.stringify(formData.durations));
      if (imageFile) {
        formDataObj.append('image', imageFile);
      } else {
        alert('Please select an image');
        return;
      }
      await createService(formDataObj);
      fetchServices();
      setFormData({
        title: '',
        description: '',
        additionalDetails: '',
        durations: [{ duration: '', charge: '' }],
      });
      setImageFile(null);
      setImagePreview('');
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
          {['title', 'description', 'additionalDetails'].map((field) => (
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
            <label htmlFor="image">Service Image</label>
            <input
              type="file"
              id="image"
              name="image"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {imagePreview && (
              <div className="image-preview" style={{ marginTop: '10px' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }} 
                />
              </div>
            )}
          </div>

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
                        {editingService?.durations?.map((item, index) => (
                          <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                            <input
                              type="text"
                              name="duration"
                              value={item.duration}
                              onChange={(e) => handleEditDurationChange(index, e)}
                              className="form-control"
                              style={{ width: '120px' }}
                            />
                            <input
                              type="number"
                              name="charge"
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
                    ) : col.key === 'image' ? (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditImageChange}
                          className="form-control"
                        />
                        {editImagePreview && (
                          <img 
                            src={editImagePreview}
                            alt="Preview" 
                            style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '8px', objectFit: 'cover' }}
                          />
                        )}
                      </div>
                    ) : (
                      <input
                        type="text"
                        name={col.key}
                        value={editingService[col.key]}
                        onChange={handleChange}
                        className="form-control"
                      />
                    )
                  ) : col.key === 'durations' ? (
                    Array.isArray(service[col.key]) && service[col.key].length > 0 ? (
                      <div>
                        {service[col.key].map((item, index) => (
                          <div key={index}>
                            <strong>{item.duration}</strong> - <span style={{ color: '#0d6efd' }}>${item.charge}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#6c757d' }}>No durations</span>
                    )
                  ) : col.key === 'image' ? (
                    <img 
                      src={service[col.key]} 
                      alt={service.title} 
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  ) : (
                    service[col.key]
                  )}
                </td>
              ))}
              <td>
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
