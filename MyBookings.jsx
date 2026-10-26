import { useEffect, useState } from 'react';
import api from './api.js';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/bookings/my').then((r) => setBookings(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    await api.delete('/bookings/' + id);
    load();
  };

  if (loading) return <p>Loading...</p>;
  return (
    <>
      <h1>My Bookings</h1>
      {bookings.length === 0 && <p>No bookings yet.</p>}
      {bookings.map((b) => (
        <div className="ticket" key={b._id}>
          <div>
            <h3>{b.movie?.title}</h3>
            <p className="muted">{b.showDate} • {b.showTime}</p>
            <p>Seats: <b>{b.seats.join(', ')}</b></p>
            <p>Total paid: <b>₹{b.total}</b></p>
          </div>
          <button className="btn danger small" onClick={() => cancel(b._id)}>Cancel</button>
        </div>
      ))}
    </>
  );
}
