// ============================================================
// LoadingScreen Component
// ============================================================
import React from 'react';

const LoadingScreen = () => (
  <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'relative', marginBottom: '2rem' }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        border: '3px solid #2a2a4a',
        borderTopColor: '#6366f1',
        borderRightColor: '#a855f7',
        animation: 'spin 1s linear infinite'
      }} />
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem'
      }}>🎮</div>
    </div>
    <div className="font-display text-xl font-bold" style={{ color: '#6366f1', textShadow: '0 0 10px rgba(99,102,241,0.7)' }}>
      ALGO<span style={{ color: '#a855f7' }}>ARCADE</span>
    </div>
    <div style={{ color: '#64748b', marginTop: 8, fontFamily: 'Rajdhani', letterSpacing: 2 }}>
      INITIALIZING...
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default LoadingScreen;
