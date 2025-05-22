import React, { useEffect, useState } from 'react';
import './BookingHistory.css';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';
import { getUserBookingHistory, cancelBooking } from '../../Services/api';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelInProgress, setCancelInProgress] = useState(false);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getUserBookingHistory();
      const allBookings = Array.isArray(data) ? data : [];

      // --- START: CRITICAL DEBUGGING LOGS ---
      console.log("--- Raw Bookings Data from Backend (before filtering) ---");
      console.log(JSON.stringify(allBookings, null, 2));
      console.log("-------------------------------------------------------");
      // --- END: CRITICAL DEBUGGING LOGS ---

      // Filter out bookings that have a 'Cancelled' status from the main state
      // Added .trim() for robustness against leading/trailing spaces in status string
      const nonCancelledBookings = allBookings.filter(
        (booking) => booking.status && booking.status.toLowerCase().trim() !== 'cancelled'
      );

      // --- START: NEW DEBUGGING LOG ---
      console.log("--- Filtered Bookings Data (after 'cancelled' removal) ---");
      console.log(JSON.stringify(nonCancelledBookings, null, 2));
      console.log("-------------------------------------------------------");
      // --- END: NEW DEBUGGING LOG ---

      setBookings(nonCancelledBookings);

    } catch (err) {
      console.error('Fetch Booking History Error:', err);
      setError('Failed to load booking history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingToCancel) => {
    // In a production app, replace window.confirm with a custom modal/dialog
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setCancelInProgress(true);
    try {
      const idToSend = bookingToCancel._id;
      await cancelBooking(idToSend); // Call the API to cancel

      // Optimistic UI update: Immediately remove the booking from the state
      setBookings(prevBookings =>
        prevBookings.filter(booking => booking._id !== bookingToCancel._id)
      );

      alert('Booking cancelled successfully.');

    } catch (err) {
      console.error('Cancellation Error:', err); // Log the full error from the backend
      alert(err?.response?.data?.message || err?.message || 'Failed to cancel booking');
      // If cancellation failed, re-fetch to revert the optimistic update and show correct state
      fetchBookings();
    } finally {
      setCancelInProgress(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  // Filterings based strictly on the 'status' property returned from the backend
  // These filters will now work on the 'bookings' state which already excludes 'cancelled' items
  const pendingBookings = bookings.filter(
    (b) => b.status && b.status.toLowerCase() === 'pending approval'
  );
  const approvedBookings = bookings.filter(
    (b) => b.status && b.status.toLowerCase() === 'approved'
  );

  return (
    <div className="page-container">
      <Header />
      <main className="content-wrapper">
        <div className="booking-history-container">
          <h2 className="booking-history-title">Booking History</h2>

          {loading && <p className="empty-state">Loading booking history...</p>}
          {error && <p className="error-message">{error}</p>}

          {!loading && pendingBookings.length === 0 && approvedBookings.length === 0 && (
            <p className="empty-state">You have no active or approved bookings yet.</p>
          )}

          {!loading && (pendingBookings.length > 0 || approvedBookings.length > 0) && (
            <>
              <section className="pending-bookings">
                <h3>Pending Approval</h3>
                {pendingBookings.length === 0 ? (
                  <p className="empty-state">No pending requests.</p>
                ) : (
                  <div className="booking-list">
                    {pendingBookings.map((booking) => (
                      <div key={booking._id} className="booking-card">
                        <div className="booking-card-content">
                          <h3>{booking.service?.title || 'N/A'}</h3>
                          <p><strong>Date:</strong> {formatDate(booking.date)}</p>
                          <p><strong>Time:</strong> {booking.time}</p>
                          <p><strong>Status:</strong> {booking.status}</p>
                          {/* Conditional rendering for Cancel button/Status badge */}
                          {booking.status && booking.status.toLowerCase().trim() !== 'cancelled' && booking.status.toLowerCase().trim() !== 'completed' ? (
                            <button
                              className="cancel-button"
                              onClick={() => handleCancelBooking(booking)}
                              disabled={cancelInProgress}
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="status-badge" style={{ marginLeft: '8px', fontWeight: 'bold', color: booking.status.toLowerCase().trim() === 'cancelled' ? 'red' : 'green' }}>
                                {booking.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="approved-bookings" style={{ marginTop: '2rem' }}>
                <h3>Approved Bookings</h3>
                {approvedBookings.length === 0 ? (
                  <p className="empty-state">No approved bookings found.</p>
                ) : (
                  <div className="booking-list">
                    {approvedBookings.map((booking) => (
                      <div key={booking._id} className="booking-card">
                        <div className="booking-card-content">
                          <h3>{booking.service?.title || 'N/A'}</h3>
                          <p><strong>Date:</strong> {formatDate(booking.date)}</p>
                          <p><strong>Time:</strong> {booking.time}</p>
                          <p><strong>Status:</strong> {booking.status}</p>
                          {booking.approvedWorker && (
                            <p><strong>Assigned Worker:</strong> {booking.approvedWorker.name}</p>
                          )}
                          {/* Conditional rendering for Cancel button/Status badge */}
                          {booking.status && booking.status.toLowerCase().trim() !== 'cancelled' && booking.status.toLowerCase().trim() !== 'completed' ? (
                            <button
                              className="cancel-button"
                              onClick={() => handleCancelBooking(booking)}
                              disabled={cancelInProgress}
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="status-badge" style={{ marginLeft: '8px', fontWeight: 'bold', color: booking.status.toLowerCase().trim() === 'cancelled' ? 'red' : (booking.isPaid ? 'green' : 'inherit') }}>
                                {booking.status} {booking.isPaid ? '(Paid)' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingHistory;
