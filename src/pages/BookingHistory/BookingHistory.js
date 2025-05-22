import React, { useEffect, useState } from 'react';
import './BookingHistory.css'; // Keep the original import as per user's request
import Header from '../Shared/Header'; // Keep the original import as per user's request
import Footer from '../Shared/Footer'; // Keep the original import as per user's request
import { getUserBookingHistory, cancelBooking } from '../../Services/api'; // Keep the original import as per user's request

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
      setBookings(data || []);
    } catch (err) {
      console.error('Fetch Booking History Error:', err);
      setError('Failed to load booking history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingToCancel) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setCancelInProgress(true);
    try {
      const idToSend = bookingToCancel.originalBookingId || bookingToCancel._id;

      await cancelBooking(idToSend);
      // After cancellation, re-fetch all bookings to get the latest status from the server
      // The updated fetchBookings will implicitly filter out the cancelled one for display
      await fetchBookings();
      alert('Booking cancelled successfully.');
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Failed to cancel booking');
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
  // We explicitly exclude 'cancelled' bookings from these lists
  const pendingBookings = bookings.filter(
    (b) => b.status && b.status.toLowerCase() === 'pending approval'
  );
  const approvedBookings = bookings.filter(
    (b) => b.status && b.status.toLowerCase() === 'approved'
  );
  // The 'cancelledBookings' filter and its rendering section have been removed entirely.

  return (
    <div className="page-container">
      <Header />
      <main className="content-wrapper">
        <div className="booking-history-container">
          <h2 className="booking-history-title">Booking History</h2>

          {loading && <p className="empty-state">Loading booking history...</p>}
          {error && <p className="error-message">{error}</p>}

          {/* Display message if no bookings are found after filtering */}
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
                          <button
                            className="cancel-button"
                            onClick={() => handleCancelBooking(booking)}
                            disabled={cancelInProgress}
                          >
                            Cancel
                          </button>
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
                          <button
                            className="cancel-button"
                            onClick={() => handleCancelBooking(booking)}
                            disabled={cancelInProgress}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* The "Cancelled Bookings" section has been removed from here. */}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingHistory;
