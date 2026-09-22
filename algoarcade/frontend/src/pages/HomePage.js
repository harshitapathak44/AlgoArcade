import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: '🧩', title: 'Puzzle Challenges', desc: 'Learn DSA through interactive puzzles, not boring lectures.' },
  { icon: '⚡', title: 'Level Up System',   desc: 'Earn XP, level up, and unlock harder challenges.' },
  { icon: '🏆', title: 'Leaderboards',      desc: 'Compete globally. Prove you are the Algorithm Wizard.' },
  { icon: '🎬', title: 'Visualizations',    desc: 'Watch sorting algorithms come alive with animation.' },
  { icon: '🎖️', title: 'Badges & Ranks',   desc: 'Collect achievement badges and earn elite ranks.' },
  { icon: '🔥', title: 'Daily Streaks',     desc: 'Keep your streak alive for bonus XP rewards.' },
];

const TOPICS = [
  { icon: '📊', name: 'Arrays',       color: '#6366f1' },
  { icon: '📚', name: 'Stacks',       color: '#8b5cf6' },
  { icon: '🚶', name: 'Queues',       color: '#06b6d4' },
  { icon: '🔗', name: 'Linked Lists', color: '#10b981' },
  { icon: '🌳', name: 'Trees',        color: '#f59e0b' },
  { icon: '🕸️', name: 'Graphs',      color: '#ef4444' },
];

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', overflowX: 'hidden' }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 1, padding: '100px 1rem 4rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 800 }}>
          {/* Badge */}
          <div className="badge badge-purple animate-fadeIn" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
            🎮 &nbsp; THE ULTIMATE DSA LEARNING GAME
          </div>

          {/* Title */}
          <h1 className="font-display animate-fadeInUp" style={{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #6366f1 50%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            ALGO<br />ARCADE
          </h1>

          <p className="animate-fadeInUp stagger-2" style={{
            color: '#94a3b8', fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            fontFamily: 'Rajdhani', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 600, margin: '0 auto 2.5rem'
          }}>
            Master Data Structures & Algorithms through puzzles, games, and challenges.
            Level up your coding skills the fun way.
          </p>

          {/* CTAs */}
          <div className="animate-fadeInUp stagger-3" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Link to="/dashboard" className="btn-primary no-underline" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
                ⚡ Continue Playing
              </Link>
            ) : (
              <>
                <Link to="/auth?mode=register" className="btn-primary no-underline" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
                  🚀 Start For Free
                </Link>
                <Link to="/auth" className="btn-outline no-underline" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
                  🔑 Login
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="animate-fadeInUp stagger-4" style={{
            display: 'flex', gap: '3rem', justifyContent: 'center', marginTop: '4rem', flexWrap: 'wrap'
          }}>
            {[['6+', 'DSA Topics'], ['150+', 'Puzzles'], ['5', 'Algo Visualizations']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div className="font-display" style={{ fontSize: '2rem', fontWeight: 900, color: '#6366f1',
                  textShadow: '0 0 10px rgba(99,102,241,0.5)' }}>{num}</div>
                <div style={{ color: '#64748b', fontFamily: 'Rajdhani', fontSize: '0.9rem', letterSpacing: 1 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOPICS ───────────────────────────────────────────── */}
      <section style={{ padding: '6rem 1rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="font-display" style={{ fontSize: '2rem', color: '#e2e8f0', marginBottom: '0.5rem' }}>
              TOPICS TO <span style={{ color: '#6366f1' }}>CONQUER</span>
            </h2>
            <p style={{ color: '#64748b', fontFamily: 'Rajdhani' }}>6 data structure categories — 5 levels each</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            {TOPICS.map((t, i) => (
              <div key={t.name} className={`arcade-card animate-fadeInUp stagger-${i + 1}`}
                style={{ padding: '1.5rem', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t.icon}</div>
                <div className="font-display" style={{ color: t.color, fontSize: '0.8rem', letterSpacing: 1 }}>{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section style={{ padding: '4rem 1rem 8rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="font-display" style={{ fontSize: '2rem', color: '#e2e8f0' }}>
              WHY <span style={{ color: '#a855f7' }}>ALGOARCADE</span>?
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`arcade-card animate-fadeInUp stagger-${(i % 3) + 1}`}
                style={{ padding: '2rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 className="font-display" style={{ color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '0.5rem', letterSpacing: 1 }}>
                  {f.title}
                </h3>
                <p style={{ color: '#64748b', fontFamily: 'Rajdhani', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      {!user && (
        <section style={{ padding: '4rem 1rem 8rem', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            maxWidth: 600, margin: '0 auto', padding: '4rem 2rem',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))',
            border: '1px solid rgba(99,102,241,0.3)', borderRadius: 16
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎮</div>
            <h2 className="font-display" style={{ color: '#e2e8f0', fontSize: '1.5rem', marginBottom: '1rem' }}>
              READY TO LEVEL UP?
            </h2>
            <p style={{ color: '#94a3b8', fontFamily: 'Rajdhani', marginBottom: '2rem' }}>
              Join thousands of developers mastering DSA the fun way.
            </p>
            <Link to="/auth?mode=register" className="btn-primary no-underline" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
              🚀 Create Free Account
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;