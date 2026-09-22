// ============================================================
// Navbar Component
// ============================================================
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = user ? [
    { to: '/dashboard',   label: 'Dashboard', icon: '⚡' },
    { to: '/topics',      label: 'Topics',    icon: '📚' },
    { to: '/visualizer',  label: 'Visualizer',icon: '🎬' },
    { to: '/leaderboard', label: 'Rankings',  icon: '🏆' },
  ] : [];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ background: 'rgba(18,18,26,0.95)', borderBottom: '1px solid #2a2a4a', backdropFilter: 'blur(10px)' }}
      className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 no-underline">
          <div style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius: 8, padding: '6px 10px' }}
            className="font-display text-white text-sm font-bold">AA</div>
          <span className="font-display text-white font-bold text-lg hidden sm:block"
            style={{ textShadow: '0 0 10px rgba(99,102,241,0.7)' }}>
            Algo<span style={{ color: '#a855f7' }}>Arcade</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 no-underline flex items-center gap-1"
              style={{
                color: isActive(link.to) ? '#6366f1' : '#94a3b8',
                background: isActive(link.to) ? 'rgba(99,102,241,0.1)' : 'transparent',
                border: isActive(link.to) ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                fontFamily: 'Rajdhani, sans-serif'
              }}>
              <span>{link.icon}</span> {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* XP bar */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="level-badge text-xs">{user.level}</div>
                <div style={{ width: 80 }}>
                  <div className="progress-bar" style={{ height: 6 }}>
                    <div className="progress-fill"
                      style={{ width: `${Math.min(100, ((user.xp % 500) / 500) * 100)}%` }} />
                  </div>
                  <div className="text-xs" style={{ color: '#64748b', fontFamily: 'Rajdhani' }}>
                    {user.xp % 500}/500 XP
                  </div>
                </div>
              </div>

              <Link to="/profile" className="flex items-center gap-2 no-underline">
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#6366f1,#a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem', fontWeight: 700, color: 'white',
                  fontFamily: 'Orbitron, monospace',
                  boxShadow: '0 0 10px rgba(99,102,241,0.4)'
                }}>
                  {user.username[0].toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-semibold" style={{ color: '#e2e8f0', fontFamily: 'Rajdhani' }}>
                  {user.username}
                </span>
              </Link>

              <button onClick={handleLogout} className="btn-outline text-xs px-3 py-2 hidden md:block">
                Exit
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="btn-outline text-xs px-4 py-2 no-underline">Login</Link>
              <Link to="/auth?mode=register" className="btn-primary text-xs px-4 py-2 no-underline">Play Now</Link>
            </>
          )}

          {/* Mobile menu toggle */}
          {user && (
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2" style={{ color: '#e2e8f0' }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && user && (
        <div style={{ background: '#12121a', borderTop: '1px solid #2a2a4a' }} className="md:hidden px-4 py-3">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 py-3 no-underline border-b"
              style={{ color: '#e2e8f0', borderColor: '#2a2a4a', fontFamily: 'Rajdhani' }}>
              {link.icon} {link.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="w-full mt-3 btn-outline text-sm">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
