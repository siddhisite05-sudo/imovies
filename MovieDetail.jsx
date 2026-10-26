import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext.jsx';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const COLS = 8;

const nextDays = (n = 5) =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

export default function MovieDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [date, setDate] = useState(nextDays()[0]);
  const [time, setTime] = useState('');
  const [booked, setBooked] = useState([]);
  const [selected, setSelected] = useState([]);
  const [msg, setMsg] = useState('');
  const days = useMemo(() => nextDays(), []);

  useEffect(() => { api.get('/movies/' + id).then((r) => setMovie(r.data)); }, [id]);

  useEffect(() => {
    setSelected([]);
    if (!time) { setBooked([]); return; }
    api.get(`/movies/${id}/booked`, { params: { date, time } }).then((r) => setBooked(r.data));
  }, [id, date, time]);

  const toggle = (seat) => {
    if (booked.includes(seat)) return;
    setSelected((s) => (s.includes(seat) ? s.filter((x) => x !== seat) : [...s, seat]));
  };

  const book = async () => {
    if (!user) return nav('/login');
    try {
      await api.post('/bookings', { movieId: id, showDate: date, showTime: time, seats: selected });
      nav('/bookings');
    } catch (e) {
      setMsg(e.response?.data?.message || 'Booking failed');
      api.get(`/movies/${id}/booked`, { params: { date, time } }).then((r) => setBooked(r.data));
      setSelected([]);
    }
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <>
      <div className="detail">
        <img src={movie.poster} alt={movie.title} />
        <div>
          <h1>{movie.title}</h1>
          <p className="muted">{movie.genre} • {movie.language} • {movie.duration} min • ⭐ {movie.rating}</p>
          <p>{movie.description}</p>
          <p><b>Ticket price:</b> ₹{movie.price}</p>
        </div>
      </div>

      <h2>Select Date</h2>
      <div className="chips">
        {days.map((d) => (
          <button key={d} className={'chip' + (d === date ? ' active' : '')} onClick={() => setDate(d)}>
            {new Date(d).toDateString().slice(0, 10)}
          </button>
        ))}
      </div>

      <h2>Select Show Time</h2>
      <div className="chips">
        {movie.showTimes.map((t) => (
          <button key={t} className={'chip' + (t === time ? ' active' : '')} onClick={() => setTime(t)}>{t}</button>
        ))}
      </div>

      {time && (
        <>
          <h2>Select Seats</h2>
          <div className="screen">SCREEN</div>
          <div className="seats">
            {ROWS.map((r) => (
              <div className="seat-row" key={r}>
                {Array.from({ length: COLS }, (_, i) => {
                  const seat = r + (i + 1);
                  const cls = booked.includes(seat) ? 'booked' : selected.includes(seat) ? 'selected' : '';
                  return <button key={seat} className={'seat ' + cls} onClick={() => toggle(seat)}>{seat}</button>;
                })}
              </div>
            ))}
          </div>
          <div className="legend">
            <span><i className="seat" /> Available</span>
            <span><i className="seat selected" /> Selected</span>
            <span><i className="seat booked" /> Booked</span>
          </div>
          {msg && <p className="error">{msg}</p>}
          <div className="summary">
            <div>
              <b>Seats:</b> {selected.join(', ') || '—'}<br />
              <b>Total:</b> ₹{selected.length * movie.price}
            </div>
            <button className="btn" disabled={!selected.length} onClick={book}>Confirm Booking</button>
          </div>
        </>
      )}
    </>
  );
}
