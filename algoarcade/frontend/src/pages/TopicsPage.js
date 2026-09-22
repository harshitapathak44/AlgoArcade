// ============================================================
// TopicsPage - Browse all DSA topics
// ============================================================
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

const DIFFICULTIES = { Beginner: '#10b981', Intermediate: '#f59e0b', Advanced: '#ef4444' };

const TopicCard = ({ topic, progress }) => {
  const solved  = progress?.totalSolved || 0;
  const unlocked = progress?.levelsUnlocked || 1;
  const pct     = Math.min(100, (solved / 5) * 100);

  return (
    <Link to={`/topics/${topic.id}`} style={{ textDecoration: 'none' }}>
      <div className="arcade-card" style={{ padding: '1.75rem', cursor: 'pointer', height: '100%',
        borderColor: solved > 0 ? `${topic.color}40` : '#2a2a4a' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.75rem', background: `${topic.color}20`, border: `1px solid ${topic.color}40`
          }}>
            {topic.icon}
          </div>
          <div>
            <span className="badge" style={{
              background: `${DIFFICULTIES[topic.difficulty]}20`,
              color: DIFFICULTIES[topic.difficulty],
              border: `1px solid ${DIFFICULTIES[topic.difficulty]}40`,
              fontSize: '0.7rem'
            }}>
              {topic.difficulty}
            </span>
          </div>
        </div>

        {/* Info */}
        <h3 className="font-display" style={{ color: topic.color, fontSize: '1rem', letterSpacing: 1, marginBottom: '0.5rem' }}>
          {topic.name.toUpperCase()}
        </h3>
        <p style={{ color: '#64748b', fontFamily: 'Rajdhani', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          {topic.description}
        </p>

        {/* Progress */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: '#94a3b8', fontFamily: 'Rajdhani', fontSize: '0.8rem' }}>
              Progress: {solved}/5 puzzles
            </span>
            <span style={{ color: topic.color, fontFamily: 'Orbitron', fontSize: '0.75rem' }}>
              Lv.{unlocked} unlocked
            </span>
          </div>
          <div className="progress-bar">
            <div style={{ height: '100%', width: `${pct}%`, background: topic.color,
              borderRadius: 4, transition: 'width 0.8s ease', position: 'relative' }}>
              {pct > 0 && (
                <div style={{ position: 'absolute', right: 0, top: 0, width: 4, height: '100%',
                  background: 'white', borderRadius: 2, boxShadow: `0 0 6px ${topic.color}` }} />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#64748b', fontFamily: 'Rajdhani', fontSize: '0.8rem' }}>
            {topic.totalLevels} levels · {topic.order <= 2 ? 'Unlocked' : `${topic.unlockRequirement} score required`}
          </span>
          <span style={{ color: topic.color, fontSize: '0.9rem' }}>▶ PLAY</span>
        </div>
      </div>
    </Link>
  );
};

const TopicsPage = () => {
  const { user } = useAuth();
  const [topics,   setTopics]   = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('All');

  useEffect(() => {
    Promise.all([
      API.get('/topics'),
      API.get('/users/progress')
    ]).then(([topicsRes, progressRes]) => {
      setTopics(topicsRes.data.topics || []);
      setProgress(progressRes.data.progress?.topicProgress || []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? topics : topics.filter(t => t.difficulty === filter);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', padding: '90px 1rem 3rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="font-display" style={{
            fontSize: 'clamp(1.5rem,4vw,2.5rem)', fontWeight: 900,
            background: 'linear-gradient(135deg,#ffffff,#6366f1)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>
            DSA TOPICS
          </h1>
          <p style={{ color: '#64748b', fontFamily: 'Rajdhani', marginTop: 4 }}>
            Choose your next challenge. Master them all to become the Algorithm Wizard.
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '0.5rem 1rem', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontFamily: 'Orbitron, monospace', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1,
              background: filter === f ? 'linear-gradient(135deg,#6366f1,#a855f7)' : 'rgba(255,255,255,0.05)',
              color: filter === f ? 'white' : '#64748b',
              transition: 'all 0.2s'
            }}>{f.toUpperCase()}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>⏳</div>
            <p style={{ fontFamily: 'Rajdhani' }}>Loading topics...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))', gap: '1.5rem' }}>
            {filtered.map((topic, i) => {
              const tp = progress.find(p => p.topicId === topic.id);
              return (
                <div key={topic.id} className={`animate-fadeInUp stagger-${(i % 6) + 1}`}>
                  <TopicCard topic={topic} progress={tp} userScore={user?.totalScore || 0} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicsPage;
