// ============================================================
// TopicDetailPage - Puzzles in a topic with level system
// ============================================================
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

const DIFF_COLOR = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };

const TopicDetailPage = () => {
  const { id }         = useParams();
  const { user }       = useAuth();
  const navigate       = useNavigate();
  const [topic,    setTopic]   = useState(null);
  const [puzzles,  setPuzzles] = useState([]);
  const [progress, setProgress]= useState(null);
  const [loading,  setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get(`/topics/${id}`),
      API.get('/users/progress')
    ]).then(([topicRes, progressRes]) => {
      setTopic(topicRes.data.topic);
      setPuzzles(topicRes.data.puzzles || []);
      const tp = progressRes.data.progress?.topicProgress?.find(t => t.topicId === id);
      setProgress(tp || { levelsUnlocked: 1, totalSolved: 0 });
    }).catch(err => {
      console.error(err);
      navigate('/topics');
    }).finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#64748b', fontFamily: 'Rajdhani' }}>⏳ Loading topic...</div>
    </div>
  );

  if (!topic) return null;

  // Group puzzles by level
  const levels = [...new Set(puzzles.map(p => p.level))].sort();
  const unlockedLevel = progress?.levelsUnlocked || 1;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', padding: '90px 1rem 3rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Back */}
        <Link to="/topics" style={{ color: '#6366f1', fontFamily: 'Rajdhani', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          ← Back to Topics
        </Link>

        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${topic.color}20, rgba(168,85,247,0.1))`,
          border: `1px solid ${topic.color}40`, borderRadius: 16, padding: '2rem', marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '3rem' }}>{topic.icon}</div>
            <div>
              <h1 className="font-display" style={{ color: topic.color, fontSize: 'clamp(1.5rem,4vw,2rem)', letterSpacing: 2 }}>
                {topic.name.toUpperCase()}
              </h1>
              <p style={{ color: '#94a3b8', fontFamily: 'Rajdhani', marginTop: 4 }}>{topic.description}</p>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div className="font-display" style={{ color: topic.color, fontSize: '1.5rem', fontWeight: 900 }}>
                {progress?.totalSolved || 0}/{puzzles.length}
              </div>
              <div style={{ color: '#64748b', fontFamily: 'Rajdhani', fontSize: '0.85rem' }}>puzzles solved</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: '1.5rem' }}>
            <div className="progress-bar">
              <div style={{
                height: '100%', borderRadius: 4, transition: 'width 0.8s ease',
                width: `${Math.min(100, ((progress?.totalSolved || 0) / puzzles.length) * 100)}%`,
                background: topic.color
              }} />
            </div>
          </div>
        </div>

        {/* Levels */}
        {levels.map(level => {
          const levelPuzzles = puzzles.filter(p => p.level === level);
          const isUnlocked   = level <= unlockedLevel;

          return (
            <div key={level} style={{ marginBottom: '2rem' }}>
              {/* Level header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: isUnlocked ? `linear-gradient(135deg,${topic.color},#a855f7)` : '#2a2a4a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Orbitron', fontSize: '0.75rem', fontWeight: 900, color: 'white',
                  boxShadow: isUnlocked ? `0 0 12px ${topic.color}60` : 'none'
                }}>{level}</div>
                <div>
                  <span className="font-display" style={{ color: isUnlocked ? '#e2e8f0' : '#64748b', fontSize: '0.85rem', letterSpacing: 1 }}>
                    LEVEL {level}
                  </span>
                  {!isUnlocked && (
                    <span style={{ marginLeft: 8, color: '#64748b', fontFamily: 'Rajdhani', fontSize: '0.8rem' }}>
                      🔒 Solve level {level - 1} puzzles to unlock
                    </span>
                  )}
                </div>
              </div>

              {/* Puzzle cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {levelPuzzles.map(puzzle => {
                  const solved = user?.solvedPuzzles?.includes(puzzle._id);
                  return (
                    <div key={puzzle._id}
                      onClick={() => isUnlocked && navigate(`/puzzle/${puzzle._id}`)}
                      style={{
                        background: solved ? 'rgba(16,185,129,0.05)' : '#1a1a2e',
                        border: `1px solid ${solved ? '#10b98140' : isUnlocked ? '#2a2a4a' : '#1a1a2e'}`,
                        borderRadius: 12, padding: '1.25rem 1.5rem',
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        cursor: isUnlocked ? 'pointer' : 'not-allowed',
                        opacity: isUnlocked ? 1 : 0.4,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => isUnlocked && !solved && (e.currentTarget.style.borderColor = topic.color + '60')}
                      onMouseLeave={e => isUnlocked && !solved && (e.currentTarget.style.borderColor = '#2a2a4a')}>

                      {/* Status icon */}
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                        background: solved ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem'
                      }}>
                        {solved ? '✅' : isUnlocked ? '🎯' : '🔒'}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ color: isUnlocked ? '#e2e8f0' : '#64748b', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1rem' }}>
                          {puzzle.title}
                        </div>
                        <div style={{ color: '#64748b', fontFamily: 'Rajdhani', fontSize: '0.8rem', marginTop: 2 }}>
                          {puzzle.type.replace('-', ' ')}
                        </div>
                      </div>

                      {/* Difficulty + XP */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{
                          display: 'inline-block', padding: '2px 8px', borderRadius: 12,
                          background: `${DIFF_COLOR[puzzle.difficulty]}20`,
                          color: DIFF_COLOR[puzzle.difficulty], fontSize: '0.75rem', fontWeight: 700,
                          fontFamily: 'Rajdhani', marginBottom: 4
                        }}>{puzzle.difficulty}</div>
                        <div style={{ color: '#6366f1', fontFamily: 'Orbitron', fontSize: '0.75rem' }}>
                          +{puzzle.xpReward} XP
                        </div>
                      </div>

                      {isUnlocked && !solved && (
                        <div style={{ color: topic.color, fontSize: '1.2rem' }}>→</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopicDetailPage;
