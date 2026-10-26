import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from './api.js';
import { useAuth } from './AuthContext.jsx';

export default function Auth({ mode }) {
  const isLogin = mode === 'login';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { saveAuth } = useAuth();
  const nav = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/' + mode, form);
      saveAuth(data);
      nav('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <form className="auth" onSubmit={submit}>
      <h1>{isLogin ? 'Login' : 'Create Account'}</h1>
      {!isLogin && <input className="input" name="name" placeholder="Full name" value={form.name} onChange={change} required />}
      <input className="input" type="email" name="email" placeholder="Email" value={form.email} onChange={change} required />
      <input className="input" type="password" name="password" placeholder="Password" value={form.password} onChange={change} required minLength={6} />
      {error && <p className="error">{error}</p>}
      <button className="btn" type="submit">{isLogin ? 'Login' : 'Sign up'}</button>
      <p className="muted">
        {isLogin ? <>New here? <Link to="/register">Create account</Link></> : <>Have an account? <Link to="/login">Login</Link></>}
      </p>
    </form>
  );
}
