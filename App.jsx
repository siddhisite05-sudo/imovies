import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Home from './Home.jsx';
import MovieDetail from './MovieDetail.jsx';
import Auth from './Auth.jsx';
import MyBookings from './MyBookings.jsx';
import { useAuth } from './AuthContext.jsx';

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/bookings" element={<Protected><MyBookings /></Protected>} />
        </Routes>
      </main>
    </>
  );
}
