import React, { useState, useEffect } from 'react';
import {
  getAllBookings,
  getApprovedBookings,
  approveBooking,
  disapproveBooking,
  updateBooking,
  deleteBooking,
  getApprovedWorkers,
} from '../../Services/api';
import './Admin.css';
import './Users.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [approvedWorkers, setApprovedWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApprovedBookings, setShowApprovedBookings] = useState(false);
  const [editBookingId, setEditBookingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Worker selection state
  const [selectedWorkers, setSelectedWorkers] = useState({});

  const columns = [
    { key: 'service.title', title: 'Service' },
    { key: 'clientInfo.name', title: 'Client' },
    { key: 'isApproved', title: 'Status', format: (value) => value ? 'Approved' : 'Pending' },
    { key: 'date', title: 'Date', format: (value) => new Date(value).toLocaleDateString() },
    { key: 'time', title: 'Time' },
    { key: 'approvedWorker.name', title: 'Worker', format: (value) => value || 'Not assigned' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [allBookings, approved, workers] = await Promise.all([
        getAllBookings(),
        getApprovedBookings(),
        getApprovedWorkers()
      ]);
      
      // Ensure we have valid arrays
      setBookings(Array.isArray(allBookings) ? allBookings : []);
      setApprovedBookings(Array.isArray(approved) ? approved : []);
      setApprovedWorkers(Array.isArray(workers) ? workers : []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (bookingId) => {
    setEditBookingId(bookingId);
  };

  const handleSave = async (bookingId) => {
    try {
      const updatedBooking = bookings.find((booking) => booking._id === bookingId);
      await updateBooking(bookingId, updatedBooking);
      setBookings(bookings.map((booking) => (booking._id === bookingId ? updatedBooking : booking)));
      setEditBookingId(null);
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const handleCancel = () => {
    setEditBookingId(null);
  };

  const handleDelete = async (id, isApproved = false) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBooking(id);
        
        // Remove from the appropriate list based on its approved status
        if (isApproved) {
          setApprovedBookings(approvedBookings.filter((booking) => booking._id !== id));
        } else {
          setBookings(bookings.filter((booking) => booking._id !== id));
        }
        
        alert('Booking deleted successfully');
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to delete booking: ' + (error.message || 'Unknown error'));
      }
    }
  };

  // Updated approve function to include worker ID and move booking
  const handleApprove = async (id) => {
    const workerId = selectedWorkers[id];
    
    if (!workerId) {
      alert('Please select a worker before approving the booking');
      return;
    }
    
    try {
      // Send the worker ID with the approval request
      const result = await approveBooking(id, { approvedWorkerId: workerId });
      
      // Get the approved booking from the original list
      const approvedBooking = bookings.find(b => b._id === id);
      
      if (approvedBooking) {
        // Remove it from the pending bookings list
        setBookings(bookings.filter(b => b._id !== id));
        
        // Prepare the updated booking with worker information
        const worker = approvedWorkers.find(w => w._id === workerId);
        const updatedBooking = {
          ...approvedBooking,
          isApproved: true,
          approvedWorker: worker
        };
        
        // Add it to the approved bookings list
        setApprovedBookings([updatedBooking, ...approvedBookings]);
        
        // Clear the selected worker for this booking
        setSelectedWorkers(prev => {
          const updated = {...prev};
          delete updated[id];
          return updated;
        });
        
        alert('Booking approved successfully!');
      }
    } catch (error) {
      console.error('Error approving booking:', error);
      alert('Failed to approve booking: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDisapprove = async (id) => {
    try {
      await disapproveBooking(id);
      
      // Find the booking being disapproved
      const disapprovedBooking = approvedBookings.find(b => b._id === id);
      
      if (disapprovedBooking) {
        // Remove from approved bookings
        setApprovedBookings(approvedBookings.filter(b => b._id !== id));
        
        // Update status and move back to regular bookings
        const updatedBooking = {
          ...disapprovedBooking,
          isApproved: false,
          approvedWorker: null
        };
        
        // Add back to regular bookings
        setBookings([updatedBooking, ...bookings]);
        
        alert('Booking has been disapproved');
      }
    } catch (error) {
      console.error('Error disapproving booking:', error.message);
      alert('Failed to disapprove booking');
    }
  };

  const handleChange = (e, bookingId) => {
    const { name, value } = e.target;
    setBookings(
      bookings.map((booking) =>
        booking._id === bookingId ? { ...booking, [name]: value } : booking
      )
    );
  };

  // Handler for worker selection
  const handleWorkerSelect = (bookingId, workerId) => {
    setSelectedWorkers(prev => ({
      ...prev,
      [bookingId]: workerId
    }));
  };

  const renderCell = (item, column) => {
    const keys = column.key.split('.');
    let value = item;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) break;
    }
    return column.format ? column.format(value) : value || 'N/A';
  };

  // Filter workers by service (if your data model supports this)
  const getWorkersForService = (serviceId) => {
    // You can implement service-specific filtering here if needed
    return approvedWorkers;
  };
  
  // Show details modal for a booking
  const showBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };
  
  // Close details modal
  const closeDetails = () => {
    setShowDetails(false);
    setSelectedBooking(null);
  };

  if (isLoading) {
    return <div className="loading">Loading bookings...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Bookings</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowApprovedBookings(!showApprovedBookings)}
        >
          {showApprovedBookings ? 'Show Pending Bookings' : 'Show Approved Bookings'}
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.title}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(showApprovedBookings ? approvedBookings : bookings).map((booking) => (
            <tr key={booking._id}>
              {columns.map((column) => (
                <td key={column.key}>
                  {editBookingId === booking._id ? (
                    <input
                      type="text"
                      name={column.key.split('.').pop()}
                      value={renderCell(booking, column)}
                      onChange={(e) => handleChange(e, booking._id)}
                      className="form-control inline-edit-input"
                    />
                  ) : (
                    renderCell(booking, column)
                  )}
                </td>
              ))}
              <td>
                {editBookingId === booking._id ? (
                  <>
                    <button onClick={() => handleSave(booking._id)} className="btn btn-primary btn-sm">
                      Save
                    </button>
                    <button onClick={handleCancel} className="btn btn-secondary btn-sm ml-2">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className="booking-actions" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <button 
                        onClick={() => showBookingDetails(booking)} 
                        className="btn btn-info btn-sm"
                        style={{ width: '100%' }}
                      >
                        View Details
                      </button>
                      
                      <button 
                        onClick={() => handleEdit(booking._id)} 
                        className="btn btn-warning btn-sm"
                        style={{ width: '100%' }}
                      >
                        Edit
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(booking._id, booking.isApproved)} 
                        className="btn btn-danger btn-sm"
                        style={{ width: '100%' }}
                      >
                        Delete
                      </button>
                      
                      {/* Show worker selection and approve options for pending bookings */}
                      {!booking.isApproved && !showApprovedBookings && (
                        <>
                          <select
                            value={selectedWorkers[booking._id] || ''}
                            onChange={(e) => handleWorkerSelect(booking._id, e.target.value)}
                            className="form-control worker-select"
                            style={{
                              padding: '5px',
                              borderRadius: '4px',
                              border: '1px solid #ccc',
                              marginTop: '5px'
                            }}
                          >
                            <option value="">-- Select Worker --</option>
                            {getWorkersForService(booking.service?._id).map((worker) => (
                              <option key={worker._id} value={worker._id}>
                                {worker.name} - {worker.service || 'General'}
                              </option>
                            ))}
                          </select>
                          
                          <button 
                            onClick={() => handleApprove(booking._id)}
                            disabled={!selectedWorkers[booking._id]}
                            className="btn btn-success btn-sm"
                            style={{ width: '100%', marginTop: '5px' }}
                          >
                            Approve Booking
                          </button>
                        </>
                      )}
                      
                      {/* Show disapprove option for approved bookings */}
                      {booking.isApproved && showApprovedBookings && (
                        <button 
                          onClick={() => handleDisapprove(booking._id)}
                          className="btn btn-warning btn-sm"
                          style={{ width: '100%' }}
                        >
                          Disapprove
                        </button>
                      )}
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div className="modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '80%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div className="modal-header" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '1px solid #eee',
              paddingBottom: '10px'
            }}>
              <h2>Booking Details</h2>
              <button 
                onClick={closeDetails} 
                style={{ 
                  backgroundColor: 'transparent', 
                  border: 'none', 
                  fontSize: '24px',
                  cursor: 'pointer' 
                }}
              >
                &times;
              </button>
            </div>
            
            <div className="booking-details" style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '10px',
              fontSize: '16px'
            }}>
              <div style={{ fontWeight: 'bold' }}>Service:</div>
              <div>{selectedBooking.service?.title || 'N/A'}</div>
              
              <div style={{ fontWeight: 'bold' }}>Date:</div>
              <div>{new Date(selectedBooking.date).toLocaleDateString()}</div>
              
              <div style={{ fontWeight: 'bold' }}>Time:</div>
              <div>{selectedBooking.time}</div>
              
              <div style={{ fontWeight: 'bold' }}>Duration:</div>
              <div>{selectedBooking.duration} </div>
              
              <div style={{ fontWeight: 'bold' }}>Status:</div>
              <div>{selectedBooking.isApproved ? 'Approved' : 'Pending'}</div>
              
              <div style={{ fontWeight: 'bold' }}>Charge:</div>
              <div>Rs.{selectedBooking.charge?.toFixed(2) || 'N/A'}</div>
              
              <div style={{ fontWeight: 'bold' }}>Assigned Worker:</div>
              <div>{selectedBooking.approvedWorker?.name || 'Not assigned'}</div>
            </div>
             
            <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <h3>Client Information</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '10px',
                fontSize: '16px' 
              }}>
                <div style={{ fontWeight: 'bold' }}>Name:</div>
    <div>{selectedBooking.clientInfo?.name}</div>

    <div style={{ fontWeight: 'bold' }}>Email:</div>
    <div>{selectedBooking.clientInfo?.email}</div>

    <div style={{ fontWeight: 'bold' }}>Phone Number:</div>
    <div>{selectedBooking.clientInfo?.phoneNumber}</div>

    <div style={{ fontWeight: 'bold' }}>Location:</div>
    <div>{selectedBooking.clientInfo?.location}</div>

    <div style={{ fontWeight: 'bold' }}>Address:</div>
    <div>{selectedBooking.clientInfo?.address}</div>
  </div>
            </div>
            
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button 
                onClick={closeDetails} 
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;