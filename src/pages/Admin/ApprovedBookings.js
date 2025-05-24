import React, { useEffect, useState } from 'react';
import {
  getApprovedBookings,
  updateBookingPaymentStatus, // Correctly imported
  deleteApprovedBooking,
} from '../../Services/api'; // Ensure this path is correct
import DataTable from '../../Components/Admin/Datatable';
import './Admin.css'; // Import styles for this component


const ApprovedBookings = () => {
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // State for custom confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null); // Function to execute on confirm

  // State for status messages (toast-like)
  const [statusMessage, setStatusMessage] = useState({
    show: false,
    type: '', // 'success' or 'error'
    text: '',
  });

  const columns = [
    { key: 'service.title', title: 'Service' },
    { key: 'clientInfo.clientName', title: 'Client' },
    { key: 'approvedWorker.name', title: 'Worker' },
    { key: 'date', title: 'Date', format: (v) => new Date(v).toLocaleDateString() },
    { key: 'time', title: 'Time' },
    { key: 'status', title: 'Status' },
    { key: 'isPaid', title: 'Paid', format: (v) => v ? 'Yes' : 'No' },
  ];

  useEffect(() => {
    fetchData();

    // Polling for updates every minute
    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval);
  }, []);

  // Function to display status messages
  const showStatus = (type, text) => {
    setStatusMessage({ show: true, type, text });
    const timer = setTimeout(() => {
      setStatusMessage({ show: false, type: '', text: '' });
    }, 3000); // Message disappears after 3 seconds
    return () => clearTimeout(timer);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const approved = await getApprovedBookings();
      setApprovedBookings(Array.isArray(approved) ? approved : []);
    } catch (err) {
      console.error(err);
      setError('Failed to load approved bookings');
      showStatus('error', 'Failed to load approved bookings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentStatusChange = async (bookingId, isPaidValue) => {
    const isPaid = isPaidValue === 'paid'; // Convert dropdown value to boolean
    try {
      await updateBookingPaymentStatus(bookingId, isPaid);
      fetchData(); // Refresh data to reflect the change
      showStatus('success', 'Payment status updated successfully!');
    } catch (err) {
      console.error('Failed to update payment status:', err);
      showStatus('error', 'Failed to update payment status. Please try again.');
    }
  };

  const handleDeleteClick = (bookingId) => {
    setConfirmMessage('Are you sure you want to delete this booking? This action cannot be undone.');
    setConfirmAction(() => async () => {
      try {
        await deleteApprovedBooking(bookingId);
        fetchData(); // Refresh data
        showStatus('success', 'Booking deleted successfully!');
      } catch (err) {
        console.error(err);
        showStatus('error', 'Failed to delete booking. Please try again.');
      } finally {
        setShowConfirmModal(false); // Close modal after action
      }
    });
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmMessage('');
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
    } else if (status === 'completed') {
      return { backgroundColor: '#e6ffe6', color: '#333' };
    }
    return {};
  };

  // Removed all inline modal styles and buttonStyle function
  // They are now handled by ApprovedBookings.css classes

  return (
    <div className="page-container">
      <h2>Approved Bookings</h2>

      {/* Status Message Display */}
      {statusMessage.show && (
        <div className={`status-message ${statusMessage.type}`}>
          {statusMessage.text}
        </div>
      )}

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
                  <td className="action-buttons">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="view-details-btn"
                    >
                      View Details
                    </button>

                    {/* Payment Status Dropdown */}
                    <select
                      value={booking.isPaid ? 'paid' : 'notPaid'}
                      onChange={(e) => handlePaymentStatusChange(booking._id, e.target.value)}
                      className={`payment-status-select ${booking.isPaid ? 'paid' : 'not-paid'}`}
                    >
                      <option value="paid">Paid</option>
                      <option value="notPaid">Not Paid</option>
                    </select>

                    {/* Delete button (remains under certain conditions) */}
                    {(!booking.status || booking.status.toLowerCase() !== 'cancelled') && (
                      !booking.isPaid && ( // Only show Delete if not paid
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteClick(booking._id)}
                        >
                          Delete
                        </button>
                      )
                    )}

                    {booking.status && booking.status.toLowerCase() === 'cancelled' && (
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteClick(booking._id)}
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

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4 className="modal-heading">Booking Details</h4>

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
                <div className="modal-value">Rs. {selectedBooking.charge ? selectedBooking.charge.toFixed(2) : '0'}</div>
              </div>
            </div>

            {/* Client Information */}
            <div className="modal-section">
              <h4>Client Information</h4>
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

            {/* Worker and Appointment Details */}
            <div className="modal-section">
              <h4>Worker & Appointment Details</h4>
              <div className="modal-row">
                <div className="modal-label">Worker:</div>
                <div className="modal-value">{selectedBooking.approvedWorker?.name || 'N/A'}</div>
              </div>
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
              <div className="modal-row">
                <div className="modal-label">Status:</div>
                <div className="modal-value">
                  <span className={`status-${(selectedBooking.status || '').toLowerCase()}`}>
                    {selectedBooking.status || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="modal-row">
                <div className="modal-label">Paid:</div>
                <div className="modal-value">
                  {selectedBooking.isPaid ? 'Yes' : 'No'}
                </div>
              </div>
            </div>

            {selectedBooking.status && selectedBooking.status.toLowerCase() === 'cancelled' && (
              <p className="cancelled-notice">
                This booking was cancelled by the client.
              </p>
            )}

            <button
              className="modal-close-btn"
              onClick={() => setSelectedBooking(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={handleCancelConfirm}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>Confirm Action</h4>
            <p>{confirmMessage}</p>
            <div className="confirm-modal-actions">
              <button className="confirm-yes" onClick={handleConfirm}>Yes</button>
              <button className="confirm-no" onClick={handleCancelConfirm}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedBookings;