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
    { key: 'clientInfo.name', title: 'Client' },
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
            <div style={modalOverlayStyle} onClick={() => setSelectedBooking(null)}>
              <div
                style={modalContentStyle}
                onClick={e => e.stopPropagation()}
                className="booking-details-modal"
              >
                <h3 style={modalHeadingStyle}>Booking Details</h3>
                
                <p style={modalTextStyle}>
                  <span style={modalLabelStyle}>Service:</span>{' '}
                  <span style={modalValueStyle}>{selectedBooking.service?.title || 'N/A'}</span>
                </p>
                
                <p style={modalTextStyle}>
                  <span style={modalLabelStyle}>Client Name:</span>{' '}
                  <span style={modalValueStyle}>{selectedBooking.clientInfo?.name || 'N/A'}</span>
                </p>
                
                <p style={modalTextStyle}>
                  <span style={modalLabelStyle}>Client Email:</span>{' '}
                  <span style={modalValueStyle}>{selectedBooking.clientInfo?.email || 'N/A'}</span>
                </p>
                
                <p style={modalTextStyle}>
                  <span style={modalLabelStyle}>Worker:</span>{' '}
                  <span style={modalValueStyle}>{selectedBooking.approvedWorker?.name || 'N/A'}</span>
                </p>
                
                <p style={modalTextStyle}>
                  <span style={modalLabelStyle}>Date:</span>{' '}
                  <span style={modalValueStyle}>{new Date(selectedBooking.date).toLocaleDateString()}</span>
                </p>
                
                <p style={modalTextStyle}>
                  <span style={modalLabelStyle}>Time:</span>{' '}
                  <span style={modalValueStyle}>{selectedBooking.time || 'N/A'}</span>
                </p>
                
                <p style={modalTextStyle}>
                  <span style={modalLabelStyle}>Additional Notes:</span>{' '}
                  <span style={modalValueStyle}>{selectedBooking.notes || 'None'}</span>
                </p>

                <button
                  onClick={() => setSelectedBooking(null)}
                  style={{
                    marginTop: 20,
                    padding: '8px 16px',
                    cursor: 'pointer',
                    borderRadius: 4,
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 'bold',
                  }}
                >
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