// ============================================================
// AuthPage - Login & Register
// ============================================================
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode]           = useState(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [form, setForm]           = useState({ username: '', email: '', password: '' });
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const { login, register }       = useAuth();
  const navigate                  = useNavigate();

  useEffect(() => { setError(''); }, [mode]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        if (!form.username.trim()) { setError('Username is required'); setLoading(false); return; }
        await register(form.username, form.email, form.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0f', padding: '100px 1rem 2rem',
      backgroundImage: 'radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)'
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎮</div>
          <h1 className="font-display" style={{
            fontSize: '1.5rem', fontWeight: 900,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>
            {mode === 'login' ? 'WELCOME BACK' : 'JOIN THE ARCADE'}
          </h1>
          <p style={{ color: '#64748b', fontFamily: 'Rajdhani', marginTop: 4 }}>
            {mode === 'login' ? 'Continue your DSA journey' : 'Start mastering algorithms today'}
          </p>
        </div>

        {/* Card */}
        <div className="arcade-card" style={{ padding: '2rem' }}>
          {/* Toggle */}
          <div style={{ display: 'flex', background: '#12121a', borderRadius: 8, padding: 4, marginBottom: '1.5rem' }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '0.6rem', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontFamily: 'Orbitron, monospace', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1,
                transition: 'all 0.2s',
                background: mode === m ? 'linear-gradient(135deg,#6366f1,#a855f7)' : 'transparent',
                color: mode === m ? 'white' : '#64748b'
              }}>
                {m === 'login' ? '🔑 LOGIN' : '🚀 REGISTER'}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem',
              color: '#ef4444', fontFamily: 'Rajdhani', fontSize: '0.9rem'
            }}>⚠️ {error}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'register' && (
              <div>
                <label style={{ color: '#94a3b8', fontFamily: 'Rajdhani', fontSize: '0.85rem', display: 'block', marginBottom: 6 }}>
                  USERNAME
                </label>
                <input className="arcade-input" name="username" type="text"
                  placeholder="YourGamerTag" value={form.username} onChange={handleChange}
                  required minLength={3} maxLength={20} />
              </div>
            )}
            <div>
              <label style={{ color: '#94a3b8', fontFamily: 'Rajdhani', fontSize: '0.85rem', display: 'block', marginBottom: 6 }}>
                EMAIL
              </label>
              <input className="arcade-input" name="email" type="email"
                placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontFamily: 'Rajdhani', fontSize: '0.85rem', display: 'block', marginBottom: 6 }}>
                PASSWORD
              </label>
              <input className="arcade-input" name="password" type="password"
                placeholder="••••••••" value={form.password} onChange={handleChange} required minLength={6} />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ marginTop: 8, padding: '1rem', fontSize: '0.85rem',
                opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? '⏳ LOADING...' : mode === 'login' ? '⚡ LOGIN' : '🚀 CREATE ACCOUNT'}
            </button>
          </form>

          {mode === 'login' && (
            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#64748b', fontFamily: 'Rajdhani', fontSize: '0.9rem' }}>
              New here?{' '}
              <span style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 600 }} onClick={() => setMode('register')}>
                Create an account →
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
