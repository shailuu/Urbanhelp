import React, { useState, useEffect } from 'react';
import {
  getApprovedWorkers,
  updateApprovedWorker,
  deleteApprovedWorker,
  createApprovedWorker
} from '../../Services/api';
import DataTable from '../../Components/Admin/Datatable';
import "./Admin.css";
import "./Users.css";

const ApprovedWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingWorkerId, setEditingWorkerId] = useState(null);
  const [formData, setFormData] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWorkerForm, setNewWorkerForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    skills: '',
    experience: ''
  });

  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'phone', title: 'Phone' },
    { key: 'service', title: 'Service' },
    { key: 'skills', title: 'Skills' },
    { key: 'experience', title: 'Experience' }
  ];

  const fetchWorkers = async () => {
    setIsLoading(true);
    try {
      const data = await getApprovedWorkers();
      setWorkers(data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleEdit = (worker) => {
    setEditingWorkerId(worker._id || worker.id);
    setFormData({
      name: worker.name || '',
      email: worker.email || '',
      phone: worker.phone || '',
      service: worker.service || '',
      skills: worker.skills || '',
      experience: worker.experience || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        await deleteApprovedWorker(id);
        setWorkers(workers.filter((worker) => (worker._id || worker.id) !== id));
      } catch (error) {
        console.error('Error deleting worker:', error);
      }
    }
  };

  const handleChange = (e, workerId) => {
    const { name, value } = e.target;
    if (workerId) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setNewWorkerForm((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSave = async (workerId) => {
    try {
      await updateApprovedWorker(workerId, formData);
      setWorkers((prevWorkers) =>
        prevWorkers.map((worker) =>
          (worker._id || worker.id) === workerId ? { ...worker, ...formData } : worker
        )
      );
      setEditingWorkerId(null);
    } catch (error) {
      console.error("Error updating worker:", error);
    }
  };

  const handleCancel = () => {
    setEditingWorkerId(null);
  };

  const handleCreateWorker = async () => {
    try {
      const newWorker = await createApprovedWorker(newWorkerForm);
      setWorkers([newWorker, ...workers]);
      setNewWorkerForm({
        name: '',
        email: '',
        phone: '',
        service: '',
        skills: '',
        experience: ''
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating worker:", error);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Approved Workers</h1>
        <button className="btn-create-user" onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Close Form' : 'Create New Worker'}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-user-form">
          <h3>Create New Worker</h3>
          <form>
            <input type="text" name="name" value={newWorkerForm.name} onChange={handleChange} placeholder="Name" required />
            <input type="email" name="email" value={newWorkerForm.email} onChange={handleChange} placeholder="Email" required />
            <input type="text" name="phone" value={newWorkerForm.phone} onChange={handleChange} placeholder="Phone" required />
            <input type="text" name="service" value={newWorkerForm.service} onChange={handleChange} placeholder="Service" required />
            <input type="text" name="skills" value={newWorkerForm.skills} onChange={handleChange} placeholder="Skills" required />
            <input type="text" name="experience" value={newWorkerForm.experience} onChange={handleChange} placeholder="Experience" required />
            <button type="button" onClick={handleCreateWorker}>Create Worker</button>
          </form>
        </div>
      )}

      <DataTable
        columns={columns}
        data={workers}
        renderCell={(column, worker) => {
          const isEditing = editingWorkerId === (worker._id || worker.id);
          return isEditing ? (
            <input
              type="text"
              name={column.key}
              value={formData[column.key] || ''}
              onChange={(e) => handleChange(e, worker._id || worker.id)}
              className="form-control inline-edit-input"
            />
          ) : (
            worker[column.key]
          );
        }}
        renderActions={(worker) => {
          const isEditing = editingWorkerId === (worker._id || worker.id);
          return isEditing ? (
            <>
              <button onClick={() => handleSave(worker._id || worker.id)} className="btn btn-primary btn-sm">Save</button>
              <button onClick={handleCancel} className="btn btn-secondary btn-sm ml-2">Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => handleEdit(worker)} className="btn btn-warning btn-sm">Edit</button>
              <button onClick={() => handleDelete(worker._id || worker.id)} className="btn btn-danger btn-sm ml-2">Delete</button>
            </>
          );
        }}
      />
    </div>
  );
};

export default ApprovedWorkers;
