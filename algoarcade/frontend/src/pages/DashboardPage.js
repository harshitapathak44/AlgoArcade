// ============================================================
// DashboardPage - User's main hub
// ============================================================
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API } from '../context/AuthContext';

const StatCard = ({ icon, label, value, color, sublabel }) => (
  <div className="arcade-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
    <div className="font-display" style={{ fontSize: '1.8rem', fontWeight: 900, color: color || '#6366f1',
      textShadow: `0 0 10px ${color || '#6366f1'}80` }}>{value}</div>
    <div style={{ color: '#94a3b8', fontFamily: 'Rajdhani', fontSize: '0.85rem', marginTop: 2 }}>{label}</div>
    {sublabel && <div style={{ color: '#64748b', fontFamily: 'Rajdhani', fontSize: '0.75rem' }}>{sublabel}</div>}
  </div>
);

const QUICK_TOPICS = [
  { id: 'arrays',       name: 'Arrays',       icon: '📊', color: '#6366f1' },
  { id: 'stacks',       name: 'Stacks',       icon: '📚', color: '#8b5cf6' },
  { id: 'queues',       name: 'Queues',       icon: '🚶', color: '#06b6d4' },
  { id: 'linked-lists', name: 'Linked Lists', icon: '🔗', color: '#10b981' },
  { id: 'trees',        name: 'Trees',        icon: '🌳', color: '#f59e0b' },
  { id: 'graphs',       name: 'Graphs',       icon: '🕸️', color: '#ef4444' },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    API.get('/users/progress').then(r => setProgress(r.data.progress)).catch(console.error);
  }, []);

  const xpPercent = user ? Math.min(100, ((user.xp % 500) / 500) * 100) : 0;
  const xpToNext  = user ? 500 - (user.xp % 500) : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', padding: '90px 1rem 3rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Welcome banner ──────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))',
          border: '1px solid rgba(99,102,241,0.3)', borderRadius: 16, padding: '2rem', marginBottom: '2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
        }}>
          <div>
            <div style={{ color: '#64748b', fontFamily: 'Rajdhani', fontSize: '0.9rem', marginBottom: 4 }}>
              WELCOME BACK, PLAYER
            </div>
            <h1 className="font-display" style={{ fontSize: 'clamp(1.5rem,4vw,2.2rem)', fontWeight: 900,
              background: 'linear-gradient(135deg,#ffffff,#6366f1)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {user?.username?.toUpperCase()}
            </h1>
            <div style={{ color: '#a855f7', fontFamily: 'Rajdhani', marginTop: 4 }}>
              🎖️ {user?.rank || 'Novice Coder'}
            </div>
          </div>

          {/* XP Progress */}
          <div style={{ minWidth: 200, flex: 1, maxWidth: 350 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#94a3b8', fontFamily: 'Rajdhani', fontSize: '0.85rem' }}>
                Level {user?.level}
              </span>
              <span style={{ color: '#6366f1', fontFamily: 'Orbitron', fontSize: '0.75rem' }}>
                {user?.xp} XP
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${xpPercent}%` }} />
            </div>
            <div style={{ color: '#64748b', fontFamily: 'Rajdhani', fontSize: '0.8rem', marginTop: 4, textAlign: 'right' }}>
              {xpToNext} XP to Level {(user?.level || 1) + 1}
            </div>
          </div>
        </div>

        {/* ── Stats grid ──────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <StatCard icon="⚡" label="Total XP"     value={user?.xp || 0}          color="#6366f1" />
          <StatCard icon="🏅" label="Score"        value={user?.totalScore || 0}   color="#f59e0b" />
          <StatCard icon="🧩" label="Solved"       value={progress?.totalSolved || 0} color="#10b981" sublabel="puzzles" />
          <StatCard icon="🔥" label="Streak"       value={`${progress?.streak || 0}d`} color="#ef4444" />
          <StatCard icon="🎖️" label="Badges"      value={progress?.badges?.length || 0} color="#a855f7" />
        </div>

        {/* ── Content grid ────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: '1.5rem' }}>

          {/* Topics Progress */}
          <div className="arcade-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="font-display" style={{ color: '#e2e8f0', fontSize: '0.9rem', letterSpacing: 1 }}>
                📚 TOPIC PROGRESS
              </h2>
              <Link to="/topics" style={{ color: '#6366f1', fontFamily: 'Rajdhani', fontSize: '0.85rem', textDecoration: 'none' }}>
                View All →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {QUICK_TOPICS.map(topic => {
                const tp = progress?.topicProgress?.find(t => t.topicId === topic.id);
                const solved = tp?.totalSolved || 0;
                const maxPuzzles = 5;
                const pct = Math.min(100, (solved / maxPuzzles) * 100);
                return (
                  <Link to={`/topics/${topic.id}`} key={topic.id} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>{topic.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ color: '#e2e8f0', fontFamily: 'Rajdhani', fontSize: '0.9rem' }}>{topic.name}</span>
                          <span style={{ color: '#64748b', fontFamily: 'Rajdhani', fontSize: '0.8rem' }}>
                            {solved}/{maxPuzzles}
                          </span>
                        </div>
                        <div className="progress-bar" style={{ height: 5 }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: topic.color,
                            borderRadius: 4, transition: 'width 0.8s ease' }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Badges */}
          <div className="arcade-card" style={{ padding: '1.5rem' }}>
            <h2 className="font-display" style={{ color: '#e2e8f0', fontSize: '0.9rem', letterSpacing: 1, marginBottom: '1.5rem' }}>
              🏆 YOUR BADGES
            </h2>
            {progress?.badges?.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {progress.badges.map((badge, i) => (
                  <div key={i} title={badge.description} style={{
                    background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)',
                    borderRadius: 10, padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: 6,
                    cursor: 'help'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>{badge.icon}</span>
                    <span style={{ color: '#a855f7', fontFamily: 'Rajdhani', fontSize: '0.8rem', fontWeight: 600 }}>
                      {badge.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔓</div>
                <p style={{ fontFamily: 'Rajdhani' }}>Solve puzzles to earn badges!</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="arcade-card" style={{ padding: '1.5rem' }}>
            <h2 className="font-display" style={{ color: '#e2e8f0', fontSize: '0.9rem', letterSpacing: 1, marginBottom: '1.5rem' }}>
              ⚡ QUICK PLAY
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { to: '/topics/arrays',  icon: '📊', label: 'Arrays Challenge', color: '#6366f1' },
                { to: '/topics/stacks',  icon: '📚', label: 'Stack Puzzles',    color: '#8b5cf6' },
                { to: '/visualizer',     icon: '🎬', label: 'Watch Sorting Viz',color: '#06b6d4' },
                { to: '/leaderboard',    icon: '🏆', label: 'View Rankings',    color: '#f59e0b' },
              ].map(item => (
                <Link to={item.to} key={item.to} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.color}30`,
                    borderRadius: 10, padding: '0.875rem 1rem',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    transition: 'all 0.2s', cursor: 'pointer'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.background = `${item.color}10`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = `${item.color}30`; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                    <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                    <span style={{ color: '#e2e8f0', fontFamily: 'Rajdhani', fontWeight: 600 }}>{item.label}</span>
                    <span style={{ color: item.color, marginLeft: 'auto' }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
