import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header className="navbar">
      <Link to="/" className="logo">🎬 IMovies</Link>
      <nav>
        {user ? (
          <>
            <Link to="/bookings">My Bookings</Link>
            <span className="hello">Hi, {user.name.split(' ')[0]}</span>
            <button className="btn small" onClick={() => { logout(); nav('/'); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn small">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
