import React, { useState, useEffect } from 'react';
import { getContacts, updateContact, deleteContact, createContact } from '../../Services/api'; // Add createContact if not already
import DataTable from '../../Components/Admin/Datatable';
import './Admin.css';
//import './Users.css';


const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingContactId, setEditingContactId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [newContactForm, setNewContactForm] = useState({
    name: '',
    email: '',
    message: '',
    status: 'new',
  });

  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'message', title: 'Message' },
    { key: 'status', title: 'Status' },
    { key: 'createdAt', title: 'Date' },
  ];

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleEdit = (contact) => {
    setEditingContactId(contact._id || contact.id);
    setFormData({
      name: contact.name || '',
      email: contact.email || '',
      message: contact.message || '',
      status: contact.status || 'new',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(id);
        setContacts(contacts.filter((c) => (c._id || c.id) !== id));
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const handleChange = (e, isNew = false) => {
    const { name, value } = e.target;
    if (isNew) {
      setNewContactForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (id) => {
    try {
      await updateContact(id, formData);
      setContacts((prev) =>
        prev.map((c) => ((c._id || c.id) === id ? { ...c, ...formData } : c))
      );
      setEditingContactId(null);
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleCreateContact = async () => {
    try {
      const newContact = await createContact(newContactForm);
      setContacts([newContact, ...contacts]);
      setNewContactForm({ name: '', email: '', message: '', status: 'new' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  };

  const handleCancel = () => setEditingContactId(null);

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 className="page-title">Contacts</h1>
        <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Close Form' : 'Create New Contact'}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-user-form">
          <h3>Create New Contact</h3>
          <form>
            <input
              type="text"
              name="name"
              value={newContactForm.name}
              onChange={(e) => handleChange(e, true)}
              placeholder="Name"
              required
            />
            <input
              type="email"
              name="email"
              value={newContactForm.email}
              onChange={(e) => handleChange(e, true)}
              placeholder="Email"
              required
            />
            <textarea
              name="message"
              value={newContactForm.message}
              onChange={(e) => handleChange(e, true)}
              placeholder="Message"
              rows="3"
              required
            />
            <select
              name="status"
              value={newContactForm.status}
              onChange={(e) => handleChange(e, true)}
              required
            >
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <button type="button" onClick={handleCreateContact}>
              Create Contact
            </button>
          </form>
        </div>
      )}

      <DataTable
        columns={columns}
        data={contacts}
        renderCell={(column, contact) => {
          const isEditing = editingContactId === (contact._id || contact.id);
          return isEditing ? (
            <input
              type="text"
              name={column.key}
              value={formData[column.key] || ''}
              onChange={(e) => handleChange(e)}
              className="form-control inline-edit-input"
            />
          ) : (
            contact[column.key]
          );
        }}
        renderActions={(contact) => {
          const isEditing = editingContactId === (contact._id || contact.id);
          return isEditing ? (
            <>
              <button onClick={() => handleSave(contact._id || contact.id)} className="btn btn-primary btn-sm">Save</button>
              <button onClick={handleCancel} className="btn btn-secondary btn-sm ml-2">Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => handleEdit(contact)} className="btn btn-warning btn-sm">Edit</button>
              <button onClick={() => handleDelete(contact._id || contact.id)} className="btn btn-danger btn-sm ml-2">Delete</button>
            </>
          );
        }}
      />
    </div>
  );
};

export default Contacts;
