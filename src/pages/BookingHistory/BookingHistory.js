import React, { useEffect, useState } from 'react';
import './BookingHistory.css'; // Optional: for styling
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
      } catch (err) {
        console.error(err);
        setError('Failed to fetch booking history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <p>Loading booking history...</p>;
  if (error) return <p>{error}</p>;
  if (bookings.length === 0) return <p>No past bookings found.</p>;

  return (
    <div className="booking-history-container">
      <h2>Your Booking History</h2>
      <div className="booking-list">
        {bookings.map((booking) => (
          <div key={booking._id} className="booking-card">
            <p><strong>Service:</strong> {booking.service?.title || 'N/A'}</p>
            <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {booking.time}</p>
            <p><strong>Status:</strong> Approved</p>
            {booking.approvedWorker && (
              <p><strong>Assigned Worker:</strong> {booking.approvedWorker.name}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;
