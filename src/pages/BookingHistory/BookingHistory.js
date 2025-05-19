import React, { useEffect, useState } from 'react';
import './BookingHistory.css';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';
import axios from 'axios';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/bookings/history/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(res.data);
        console.log('Booking statuses:', res.data.map(b => b.status));
      } catch (err) {
        console.error(err);
        setError('Failed to fetch booking history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/bookings/${bookingId}/cancel`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the local state to reflect the cancellation
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking._id === bookingId ? { ...booking, status: 'Cancelled' } : booking
        )
      );
      console.log(`Booking ${bookingId} cancelled successfully (admin panel updated).`);
      // Removed direct user success notification

    } catch (err) {
      console.error("Cancel Booking Error:", err);
      setError('Failed to cancel booking. Please try again.');
      // You can still provide an error message to the user if the cancellation fails
      // alert("Failed to cancel booking. Please try again.");
    }
  };

  const pendingBookings = bookings.filter(
    (b) => b.status && b.status.toLowerCase().includes('pending')
  );
  const approvedBookings = bookings.filter(
    (b) => b.status && b.status.toLowerCase().includes('approved')
  );
  const cancelledBookings = bookings.filter(
    (b) => b.status && b.status.toLowerCase().includes('cancelled')
  );

  return (
    <div className="page-container">
      <Header />
      <main className="content-wrapper">
        <div className="booking-history-container">
          <h2 className="booking-history-title">Booking History</h2>

          {loading && <p className="empty-state">Loading booking history...</p>}
          {error && <p className="empty-state">{error}</p>}

          {!loading && bookings.length === 0 && (
            <p className="empty-state">No bookings found.</p>
          )}

          {!loading && bookings.length > 0 && (
            <>
              <section className="pending-bookings">
                <h3>Pending Bookings</h3>
                {pendingBookings.length === 0 ? (
                  <p className="empty-state">No pending requests.</p>
                ) : (
                  <div className="booking-list">
                    {pendingBookings.map((booking) => (
                      <div key={booking._id} className="booking-card">
                        <div className="booking-card-content">
                          <h3>{booking.service?.title || 'N/A'}</h3>
                          <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                          <p><strong>Time:</strong> {booking.time}</p>
                          <p><strong>Status:</strong> {booking.status}</p>
                          <button
                            className="cancel-button"
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={booking.status.toLowerCase() === 'cancelled'}
                          >
                            {booking.status.toLowerCase() === 'cancelled' ? 'Cancelled' : 'Cancel'}
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
                          <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                          <p><strong>Time:</strong> {booking.time}</p>
                          <p><strong>Status:</strong> {booking.status}</p>
                          {booking.approvedWorker && (
                            <p><strong>Assigned Worker:</strong> {booking.approvedWorker.name}</p>
                          )}
                          <button
                            className="cancel-button"
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={booking.status.toLowerCase() === 'cancelled'}
                          >
                            {booking.status.toLowerCase() === 'cancelled' ? 'Cancelled' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="cancelled-bookings" style={{ marginTop: '2rem' }}>
                <h3>Cancelled Bookings</h3>
                {cancelledBookings.length === 0 ? (
                  <p className="empty-state">No cancelled bookings.</p>
                ) : (
                  <div className="booking-list">
                    {cancelledBookings.map((booking) => (
                      <div key={booking._id} className="booking-card">
                        <div className="booking-card-content">
                          <h3>{booking.service?.title || 'N/A'}</h3>
                          <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                          <p><strong>Time:</strong> {booking.time}</p>
                          <p><strong>Status:</strong> {booking.status}</p>
                          <button
                            className="cancel-button"
                            disabled={true} // Already cancelled, so disable
                          >
                            Cancelled
                          </button>
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