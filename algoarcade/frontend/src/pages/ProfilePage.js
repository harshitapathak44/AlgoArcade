// ============================================================
// ProfilePage
// ============================================================
import React, { useState, useEffect } from 'react';
import { useAuth, API } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    API.get('/users/progress')
      .then(r => setProgress(r.data.progress))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const xpPercent = user ? Math.min(100, ((user.xp % 500) / 500) * 100) : 0;

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0f', padding:'90px 1rem 3rem' }}>
      <div style={{ maxWidth: 800, margin:'0 auto' }}>

        {/* Profile Header */}
        <div style={{
          background:'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))',
          border:'1px solid rgba(99,102,241,0.3)', borderRadius:16, padding:'2.5rem',
          textAlign:'center', marginBottom:'2rem'
        }}>
          {/* Avatar */}
          <div style={{
            width:90, height:90, borderRadius:'50%', margin:'0 auto 1rem',
            background:'linear-gradient(135deg,#6366f1,#a855f7)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'Orbitron', fontWeight:900, color:'white', fontSize:'2rem',
            boxShadow:'0 0 30px rgba(99,102,241,0.5)'
          }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>

          <h1 className="font-display" style={{ fontSize:'1.8rem', fontWeight:900, color:'#e2e8f0', marginBottom:4 }}>
            {user?.username?.toUpperCase()}
          </h1>
          <div style={{ color:'#a855f7', fontFamily:'Rajdhani', fontSize:'1rem', marginBottom:'1rem' }}>
            🎖️ {user?.rank || 'Novice Coder'}
          </div>
          <div style={{ color:'#64748b', fontFamily:'Rajdhani', fontSize:'0.85rem' }}>
            {user?.email}
          </div>

          {/* XP bar */}
          <div style={{ maxWidth:300, margin:'1.5rem auto 0' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ color:'#94a3b8', fontFamily:'Rajdhani', fontSize:'0.85rem' }}>Level {user?.level}</span>
              <span style={{ color:'#6366f1', fontFamily:'Orbitron', fontSize:'0.75rem' }}>{user?.xp} XP</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width:`${xpPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
          {[
            { icon:'🏅', label:'Total Score',  value: user?.totalScore || 0,             color:'#f59e0b' },
            { icon:'⚡', label:'Total XP',     value: user?.xp || 0,                     color:'#6366f1' },
            { icon:'🧩', label:'Puzzles Solved',value: progress?.totalSolved || 0,        color:'#10b981' },
            { icon:'🔥', label:'Current Streak',value:`${progress?.streak || 0}d`,        color:'#ef4444' },
            { icon:'🎖️', label:'Badges',       value: progress?.badges?.length || 0,     color:'#a855f7' },
            { icon:'📈', label:'Level',         value: user?.level || 1,                  color:'#06b6d4' },
          ].map(stat => (
            <div key={stat.label} className="arcade-card" style={{ padding:'1.25rem', textAlign:'center' }}>
              <div style={{ fontSize:'1.5rem', marginBottom:'0.25rem' }}>{stat.icon}</div>
              <div className="font-display" style={{ color:stat.color, fontSize:'1.5rem', fontWeight:900 }}>{stat.value}</div>
              <div style={{ color:'#64748b', fontFamily:'Rajdhani', fontSize:'0.8rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Badges grid */}
        <div className="arcade-card" style={{ padding:'1.5rem', marginBottom:'2rem' }}>
          <h2 className="font-display" style={{ color:'#e2e8f0', fontSize:'0.9rem', letterSpacing:1, marginBottom:'1.5rem' }}>
            🏆 ACHIEVEMENTS
          </h2>
          {loading ? (
            <div style={{ color:'#64748b', fontFamily:'Rajdhani', textAlign:'center', padding:'1rem' }}>Loading...</div>
          ) : progress?.badges?.length > 0 ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'1rem' }}>
              {progress.badges.map((badge, i) => (
                <div key={i} style={{
                  background:'rgba(168,85,247,0.08)', border:'1px solid rgba(168,85,247,0.25)',
                  borderRadius:10, padding:'1rem', display:'flex', alignItems:'center', gap:'0.75rem'
                }}>
                  <span style={{ fontSize:'1.75rem' }}>{badge.icon}</span>
                  <div>
                    <div style={{ color:'#a855f7', fontFamily:'Orbitron', fontSize:'0.75rem', fontWeight:700 }}>{badge.name}</div>
                    <div style={{ color:'#64748b', fontFamily:'Rajdhani', fontSize:'0.8rem', marginTop:2 }}>{badge.description}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'2rem', color:'#64748b' }}>
              <div style={{ fontSize:'2rem', marginBottom:8 }}>🔓</div>
              <p style={{ fontFamily:'Rajdhani' }}>No badges yet. Start solving puzzles!</p>
            </div>
          )}
        </div>

        {/* Logout */}
        <div style={{ textAlign:'center' }}>
          <button onClick={logout} className="btn-outline" style={{ padding:'0.75rem 2rem' }}>
            🚪 LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
