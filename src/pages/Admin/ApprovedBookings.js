import React, { useEffect, useState } from 'react';
import {
  getApprovedBookings,
  disapproveBooking,
  deleteApprovedBooking,
} from '../../Services/api';
import './Admin.css';
import './Users.css'; // Assuming Users.css contains modal styles if not inline

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
    { key: 'status', title: 'Status' },
    { key: 'isPaid', title: 'Paid', format: (v) => v ? 'Yes' : 'No' }, // Added Paid column
  ];

  useEffect(() => {
    fetchData();

    // Polling for updates every minute to catch cancellations and payment status changes
    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval);
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
      fetchData(); // Refresh data instead of filtering
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
      fetchData(); // Refresh data
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

  // Function to determine row style based on status
  const getRowStyle = (status) => {
    if (!status) return {};

    status = status.toLowerCase();
    if (status === 'cancelled') {
      return { backgroundColor: '#ffeeee', color: '#777' };
    } else if (status === 'completed') { // Style for completed bookings
      return { backgroundColor: '#e6ffe6', color: '#333' }; // Light green background
    }
    return {};
  };

  // Replicated Modal Styles from Bookings.js
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

  const modalSectionStyle = {
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  };

  const modalRowStyle = {
    display: 'flex',
    marginBottom: '5px',
  };

  const modalLabelStyle = {
    fontWeight: 'bold',
    color: '#333',
    flexBasis: '30%',
    minWidth: '100px',
  };

  const modalValueStyle = {
    color: '#0056b3',
    fontWeight: 'normal',
    flexBasis: '70%',
  };

  const modalHeadingStyle = {
    color: '#222',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '15px',
  };

  const modalCloseBtnStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'block',
    width: '100%',
    textAlign: 'center',
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
      <h2>Approved Bookings</h2>
      <div className="controls-row">
        {/* Refresh button, if desired, can be added here */}
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.title}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvedBookings.length > 0 ? (
              approvedBookings.map((booking) => (
                <tr
                  key={booking._id}
                  style={getRowStyle(booking.status)}
                >
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.key === 'status' ? (
                        <span className={`status-${(booking.status || '').toLowerCase()}`}>
                          {renderCell(booking, col)}
                        </span>
                      ) : (
                        renderCell(booking, col)
                      )}
                    </td>
                  ))}
                  <td>
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      style={buttonStyle('#28a745')}
                    >
                      View Details
                    </button>

                    {(!booking.status || booking.status.toLowerCase() !== 'cancelled') && (
                      <>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleDisapprove(booking._id)}
                          style={buttonStyle('#ffc107')}
                        >
                          Disapprove
                        </button>
                        {!booking.isPaid && ( // Only show Delete if not paid
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(booking._id)}
                            style={buttonStyle('#dc3545')}
                          >
                            Delete
                          </button>
                        )}
                      </>
                    )}

                    {booking.status && booking.status.toLowerCase() === 'cancelled' && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(booking._id)}
                        style={buttonStyle('#dc3545')}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1}>No approved bookings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Booking Details Modal - Updated to match Bookings.js */}
      {selectedBooking && (
        <div style={modalOverlayStyle} onClick={() => setSelectedBooking(null)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h4 style={modalHeadingStyle}>Booking Details</h4>

            {/* Service Details */}
            <div style={modalSectionStyle}>
              <h4>Service Details</h4>
              <div style={modalRowStyle}>
                <div style={modalLabelStyle}>Service:</div>
                <div style={modalValueStyle}>{selectedBooking.service?.title || 'N/A'}</div>
              </div>
              <div style={modalRowStyle}>
                <div style={modalLabelStyle}>Duration:</div>
                <div style={modalValueStyle}>{selectedBooking.duration || 'N/A'}</div>
              </div>
              <div style={modalRowStyle}>
                <div style={modalLabelStyle}>Price:</div>
                <div style={modalValueStyle}>Rs. {selectedBooking.charge ? selectedBooking.charge.toFixed(2) : '0'}</div>
              </div>
            </div>

            {/* Client Information */}
            <div style={modalSectionStyle}>
              <h4>Client Information</h4>
              <div style={modalRowStyle}>
                <div style={modalLabelStyle}>Name:</div>
                <div style={modalValueStyle}>{selectedBooking.clientInfo?.clientName || 'N/A'}</div>
              </div>
              <div style={modalRowStyle}>
                <div style={modalLabelStyle}>Email:</div>
                <div style={modalValueStyle}>{selectedBooking.clientInfo?.email || 'N/A'}</div>
              </div>
              <div style={modalRowStyle}>
                <div style={modalLabelStyle}>Phone:</div>
                <div style={modalValueStyle}>{selectedBooking.clientInfo?.phone || 'N/A'}</div>
              </div>
              <div style={modalRowStyle}>
                <div style={modalLabelStyle}>Location:</div>
                <div style={modalValueStyle}>{selectedBooking.clientInfo?.location || 'N/A'}</div>
              </div>
              <div style={modalRowStyle}>
                <div style={modalLabelStyle}>Address:</div>
                <div style={modalValueStyle}>{selectedBooking.clientInfo?.address || 'N/A'}</div>
              </div>
            </div>

            {/* Worker and Appointment Details */}
            <div style={modalSectionStyle}>
              <h4>Worker & Appointment Details</h4>
              <div style={modalRowStyle}>
                <div style={modalLabelStyle}>Worker:</div>
                <div style={modalValueStyle}>{selectedBooking.approvedWorker?.name || 'N/A'}</div>
              </div>
              <div style={modalRowStyle}>
                <div style={modalLabelStyle}>Date:</div>
                <div style={modalValueStyle}>{new Date(selectedBooking.date).toLocaleDateString(undefined, {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}</div>
              </div>
              <div style={modalRowStyle}>
                <div style={modalLabelStyle}>Time:</div>
                <div style={modalValueStyle}>{selectedBooking.time || 'N/A'}</div>
              </div>
              <div style={modalRowStyle}>
                <div style={modalLabelStyle}>Status:</div>
                <div style={modalValueStyle}>
                  <span className={`status-${(selectedBooking.status || '').toLowerCase()}`}>
                    {selectedBooking.status || 'N/A'}
                  </span>
                </div>
              </div>
              <div style={modalRowStyle}>
                <div style={modalLabelStyle}>Paid:</div>
                <div style={modalValueStyle}>
                  {selectedBooking.isPaid ? 'Yes' : 'No'}
                </div>
              </div>
            </div>

            {selectedBooking.status && selectedBooking.status.toLowerCase() === 'cancelled' && (
              <p className="cancelled-notice" style={{ color: '#dc3545', fontWeight: 'bold', textAlign: 'center', marginTop: '15px' }}>
                This booking was cancelled by the client.
              </p>
            )}

            <button
              className="modal-close-btn"
              onClick={() => setSelectedBooking(null)}
              style={modalCloseBtnStyle}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedBookings;
