import React, { useEffect, useState } from 'react';
import {
  getAllBookings,
  updateBooking,
  deleteBooking,
  approveBooking,
  getApprovedWorkers,
} from '../../Services/api';
import './Admin.css';
import './Users.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [approvedWorkers, setApprovedWorkers] = useState([]);
  const [selectedWorkers, setSelectedWorkers] = useState({});
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { key: 'service.title', title: 'Service' },
    { key: 'clientInfo.clientName', title: 'Client' },
    { key: 'date', title: 'Date', format: (v) => new Date(v).toLocaleDateString() },
    { key: 'time', title: 'Time' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [all, workers] = await Promise.all([getAllBookings(), getApprovedWorkers()]);
      const pending = Array.isArray(all) ? all.filter(b => !b.isApproved) : [];
      setBookings(pending);
      setApprovedWorkers(workers || []);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    const workerId = selectedWorkers[id];
    if (!workerId) return alert('Select a worker first');
    try {
      await approveBooking(id, { approvedWorkerId: workerId });
      setBookings(prev => prev.filter(b => b._id !== id));
      alert('Approved successfully');
    } catch (err) {
      console.error(err);
      alert('Approval failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      await deleteBooking(id);
      setBookings(prev => prev.filter(b => b._id !== id));
      alert('Deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const getWorkersForBooking = (booking) => {
    const title = booking.service?.title?.toLowerCase();
    return approvedWorkers.filter(worker => {
      if (worker.service?.toLowerCase() === title) return true;
      if (Array.isArray(worker.skills)) {
        return worker.skills.some(skill => skill.toLowerCase().includes(title));
      }
      return false;
    });
  };

  const renderCell = (item, column) => {
    const keys = column.key.split('.');
    let value = item;
    for (const key of keys) value = value?.[key];
    return column.format ? column.format(value) : value || 'N/A';
  };

  // Modal Styles
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
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
    color: '#0056b3',
    fontWeight: 'normal',
  };

  const modalHeadingStyle = {
    color: '#222',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '15px',
  };

  const buttonStyle = (bgColor = '#007bff') => ({
    marginRight: 6,
    padding: '6px 12px',
    cursor: 'pointer',
    borderRadius: 4,
    backgroundColor: bgColor,
    color: '#fff',
    border: 'none',
    fontSize: '14px',
  });

  return (
    <div className="page-container">
      <h2>Pending Bookings</h2>
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
              {bookings.map(booking => (
                <tr key={booking._id}>
                  {columns.map(c => (
                    <td key={c.key}>{renderCell(booking, c)}</td>
                  ))}
                  <td>
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      style={buttonStyle('#28a745')}
                    >
                      View Details
                    </button>
                    <select
                      value={selectedWorkers[booking._id] || ''}
                      onChange={(e) =>
                        setSelectedWorkers(prev => ({ ...prev, [booking._id]: e.target.value }))
                      }
                      style={{ marginRight: 6 }}
                    >
                      <option value="">Select Worker</option>
                      {getWorkersForBooking(booking).map(worker => (
                        <option key={worker._id} value={worker._id}>
                          {worker.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleApprove(booking._id)}
                      disabled={!selectedWorkers[booking._id]}
                      style={buttonStyle('#28a745')}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDelete(booking._id)}
                      style={buttonStyle('#dc3545')}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal */}
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

export default Bookings;