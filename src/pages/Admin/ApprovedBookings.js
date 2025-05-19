import React, { useEffect, useState } from 'react';
import {
  getApprovedBookings,
  disapproveBooking,
  deleteApprovedBooking,
} from '../../Services/api';
import './Admin.css';
import './Users.css';

const ApprovedBookings = () => {
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const columns = [
    { key: 'service.title', title: 'Service' },
    { key: 'clientInfo.clientName', title: 'Client' },
    { key: 'approvedWorker.name', title: 'Worker' },
    { key: 'date', title: 'Date', format: (v) => new Date(v).toLocaleDateString() },
    { key: 'time', title: 'Time' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const approved = await getApprovedBookings();
      setApprovedBookings(Array.isArray(approved) ? approved : []);
    } catch (err) {
      console.error(err);
      setError('Failed to load approved bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisapprove = async (id) => {
    if (!window.confirm('Disapprove this booking?')) return;
    try {
      await disapproveBooking(id);
      setApprovedBookings(prev => prev.filter(b => b._id !== id));
      alert('Booking disapproved');
    } catch (err) {
      console.error(err);
      alert('Failed to disapprove');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      await deleteApprovedBooking(id);
      setApprovedBookings(prev => prev.filter(b => b._id !== id));
      alert('Booking deleted');
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const renderCell = (item, column) => {
    const keys = column.key.split('.');
    let value = item;
    for (const key of keys) value = value?.[key];
    return column.format ? column.format(value) : value || 'N/A';
  };

  // Improved modal styles with text color fixes
  const modalOverlayStyle = {
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', 
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 8,
    width: '90%', 
    maxWidth: 500, 
    maxHeight: '80vh', 
    overflowY: 'auto',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  };

  // Added specific styles for modal text
  const modalTextStyle = {
    color: '#333',
    margin: '8px 0',
    fontSize: '16px',
  };

  const modalLabelStyle = {
    fontWeight: 'bold',
    color: '#333',
  };

  const modalValueStyle = {
    color: '#0056b3', // Blue color for values
    fontWeight: 'normal',
  };

  const modalHeadingStyle = {
    color: '#222',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '15px',
  };

  return (
    <div className="page-container">
      <h2>Approved Bookings</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                {columns.map(c => <th key={c.key}>{c.title}</th>)}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvedBookings.map(booking => (
                <tr key={booking._id}>
                  {columns.map(c => (
                    <td key={c.key}>{renderCell(booking, c)}</td>
                  ))}
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => setSelectedBooking(booking)}
                      style={{ marginRight: 6 }}
                    >
                      View Details
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleDisapprove(booking._id)}
                      style={{ marginRight: 6 }}
                    >
                      Disapprove
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(booking._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedBooking && (
  <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      
      {/* Service Details */}
      <div className="modal-section">
        <h4>Service Details</h4>
        <div className="modal-row">
          <div className="modal-label">Service:</div>
          <div className="modal-value">{selectedBooking.service?.title || 'N/A'}</div>
        </div>
        <div className="modal-row">
          <div className="modal-label">Duration:</div>
          <div className="modal-value">{selectedBooking.duration || 'N/A'}</div>
        </div>
        <div className="modal-row">
          <div className="modal-label">Price:</div>
          <div className="modal-value">Rs. {selectedBooking.charge || '0'}</div>
        </div>
      </div>

      {/* Your Information */}
      <div className="modal-section">
        <h4>Your Information</h4>
        <div className="modal-row">
          <div className="modal-label">Name:</div>
          <div className="modal-value">{selectedBooking.clientInfo?.clientName || 'N/A'}</div>
        </div>
        <div className="modal-row">
          <div className="modal-label">Email:</div>
          <div className="modal-value">{selectedBooking.clientInfo?.email || 'N/A'}</div>
        </div>
        <div className="modal-row">
          <div className="modal-label">Phone:</div>
          <div className="modal-value">{selectedBooking.clientInfo?.phone || 'N/A'}</div>
        </div>
        <div className="modal-row">
          <div className="modal-label">Location:</div>
          <div className="modal-value">{selectedBooking.clientInfo?.location || 'N/A'}</div>
        </div>
        <div className="modal-row">
          <div className="modal-label">Address:</div>
          <div className="modal-value">{selectedBooking.clientInfo?.address || 'N/A'}</div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="modal-section">
        <h4>Appointment Details</h4>
        <div className="modal-row">
          <div className="modal-label">Date:</div>
          <div className="modal-value">{new Date(selectedBooking.date).toLocaleDateString(undefined, {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}</div>
        </div>
        <div className="modal-row">
          <div className="modal-label">Time:</div>
          <div className="modal-value">{selectedBooking.time || 'N/A'}</div>
        </div>
      </div>

      <button className="modal-close-btn" onClick={() => setSelectedBooking(null)}>
        Close
      </button>
    </div>
  </div>
)}
        </>
      )}
    </div>
  );
};

export default ApprovedBookings;