import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      api.get('/movies', { params: { search } })
        .then((r) => setMovies(r.data))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <>
      <h1>Now Showing</h1>
      <input className="input" placeholder="Search movies..." value={search}
             onChange={(e) => setSearch(e.target.value)} />
      {loading ? <p>Loading...</p> : movies.length === 0 ? <p>No movies found.</p> : (
        <div className="grid">
          {movies.map((m) => (
            <Link to={'/movie/' + m._id} className="card" key={m._id}>
              <img src={m.poster} alt={m.title} />
              <div className="card-body">
                <h3>{m.title}</h3>
                <p className="muted">{m.genre} • {m.language}</p>
                <p>⭐ {m.rating} &nbsp; ₹{m.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
