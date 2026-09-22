// ============================================================
// PuzzlePage - Interactive puzzle challenge
// ============================================================
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

const DIFF_COLOR = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };

const PuzzlePage = () => {
  const { id }     = useParams();
  const { user, updateUser } = useAuth();
  const navigate   = useNavigate();

  const [puzzle,     setPuzzle]     = useState(null);
  const [selected,   setSelected]   = useState(null);
  const [submitted,  setSubmitted]  = useState(false);
  const [result,     setResult]     = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showHint,   setShowHint]   = useState(false);
  const [hintIndex,  setHintIndex]  = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Timer
  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => setTimeElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [submitted]);

  useEffect(() => {
    API.get(`/puzzles/${id}`)
      .then(r => setPuzzle(r.data.puzzle))
      .catch(() => navigate('/topics'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  const handleSubmit = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    try {
      const res = await API.post(`/puzzles/${id}/submit`, { answer: selected });
      setResult(res.data);
      setSubmitted(true);

      // Update user state if score changed
      if (res.data.correct && !res.data.alreadySolved) {
        const progressRes = await API.get('/users/progress');
        // Trigger re-fetch of user context
        const meRes = await API.get('/auth/me');
        updateUser(meRes.data.user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#0a0a0f', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ color:'#64748b', fontFamily:'Rajdhani', fontSize:'1.2rem' }}>⏳ Loading puzzle...</div>
    </div>
  );

  if (!puzzle) return null;
  const alreadySolved = user?.solvedPuzzles?.includes(id);

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0f', padding:'90px 1rem 3rem' }}>
      <div style={{ maxWidth: 750, margin: '0 auto' }}>

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem', flexWrap:'wrap', gap:'0.5rem' }}>
          <Link to={`/topics/${puzzle.topicId}`} style={{ color:'#6366f1', fontFamily:'Rajdhani', textDecoration:'none' }}>
            ← Back to Topic
          </Link>
          <div style={{ display:'flex', gap:'1rem', alignItems:'center' }}>
            {!submitted && (
              <div style={{ color:'#94a3b8', fontFamily:'Orbitron', fontSize:'0.8rem' }}>
                ⏱ {formatTime(timeElapsed)}
              </div>
            )}
            <div style={{
              padding:'3px 10px', borderRadius:12, fontSize:'0.75rem', fontWeight:700, fontFamily:'Rajdhani',
              background:`${DIFF_COLOR[puzzle.difficulty]}20`, color:DIFF_COLOR[puzzle.difficulty],
              border:`1px solid ${DIFF_COLOR[puzzle.difficulty]}40`
            }}>{puzzle.difficulty}</div>
            <div className="badge badge-purple">+{puzzle.xpReward} XP</div>
          </div>
        </div>

        {/* Main card */}
        <div className="arcade-card" style={{ padding:'2rem', marginBottom:'1.5rem' }}>
          {/* Puzzle title */}
          <div style={{ marginBottom:'1.5rem' }}>
            <div style={{ color:'#64748b', fontFamily:'Rajdhani', fontSize:'0.8rem', letterSpacing:1, marginBottom:4 }}>
              PUZZLE CHALLENGE
            </div>
            <h1 className="font-display" style={{ color:'#e2e8f0', fontSize:'1.3rem', fontWeight:700 }}>
              {puzzle.title}
            </h1>
          </div>

          {/* Question */}
          <div style={{
            background:'rgba(99,102,241,0.05)', border:'1px solid rgba(99,102,241,0.2)',
            borderRadius:12, padding:'1.5rem', marginBottom:'2rem'
          }}>
            <p style={{ color:'#e2e8f0', fontFamily:'Rajdhani', fontSize:'1.05rem', lineHeight:1.7 }}>
              {puzzle.question}
            </p>
          </div>

          {/* Options */}
          {puzzle.options && puzzle.options.length > 0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'1.5rem' }}>
              {puzzle.options.map((opt, i) => {
                let borderColor = '#2a2a4a', bgColor = 'transparent', textColor = '#94a3b8';
                if (selected === opt && !submitted) { borderColor = '#6366f1'; bgColor = 'rgba(99,102,241,0.1)'; textColor = '#e2e8f0'; }
                if (submitted && result) {
                  if (opt === result.correctAnswer || (result.correct && opt === selected)) {
                    borderColor = '#10b981'; bgColor = 'rgba(16,185,129,0.1)'; textColor = '#10b981';
                  } else if (opt === selected && !result.correct) {
                    borderColor = '#ef4444'; bgColor = 'rgba(239,68,68,0.1)'; textColor = '#ef4444';
                  }
                }

                return (
                  <button key={i} onClick={() => !submitted && setSelected(opt)} style={{
                    background: bgColor, border:`2px solid ${borderColor}`,
                    borderRadius:10, padding:'1rem 1.25rem', cursor:submitted ? 'default' : 'pointer',
                    display:'flex', alignItems:'center', gap:'0.75rem', transition:'all 0.2s', textAlign:'left'
                  }}>
                    <div style={{
                      width:28, height:28, borderRadius:'50%', flexShrink:0,
                      border:`2px solid ${borderColor}`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontFamily:'Orbitron', fontSize:'0.7rem', color:textColor
                    }}>
                      {submitted && result?.correct && opt === selected ? '✓' :
                       submitted && !result?.correct && opt === selected ? '✗' :
                       ['A','B','C','D'][i]}
                    </div>
                    <span style={{ color:textColor, fontFamily:'Rajdhani', fontSize:'1rem', fontWeight:submitted && opt===selected ? 700 : 400 }}>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Actions */}
          {!submitted ? (
            <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
              <button onClick={handleSubmit} disabled={!selected || submitting} className="btn-primary"
                style={{ flex:1, padding:'1rem', opacity:(!selected || submitting) ? 0.5 : 1,
                  cursor:(!selected || submitting) ? 'not-allowed' : 'pointer' }}>
                {submitting ? '⏳ CHECKING...' : '⚡ SUBMIT ANSWER'}
              </button>
              {puzzle.hints?.length > 0 && (
                <button onClick={() => { setShowHint(true); setHintIndex(Math.min(hintIndex + 1, puzzle.hints.length - 1)); }}
                  className="btn-outline" style={{ padding:'1rem 1.5rem', whiteSpace:'nowrap' }}>
                  💡 HINT {hintIndex + 1}/{puzzle.hints.length}
                </button>
              )}
            </div>
          ) : (
            // Result display
            <div>
              <div style={{
                background: result?.correct ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                border:`1px solid ${result?.correct ? '#10b981' : '#ef4444'}`,
                borderRadius:12, padding:'1.5rem', marginBottom:'1rem'
              }}>
                <div style={{ fontSize:'1.5rem', marginBottom:'0.5rem' }}>
                  {result?.correct ? '🎉' : '💀'}
                </div>
                <div className="font-display" style={{ color: result?.correct ? '#10b981' : '#ef4444', fontSize:'1rem', marginBottom:'0.5rem' }}>
                  {result?.alreadySolved ? 'ALREADY SOLVED' : result?.correct ? 'CORRECT!' : 'WRONG ANSWER'}
                </div>
                {result?.correct && !result?.alreadySolved && (
                  <div style={{ color:'#94a3b8', fontFamily:'Rajdhani' }}>
                    +{result.xpGained} XP &nbsp;·&nbsp; +{result.scoreGained} Score
                    {result.leveledUp && <span style={{ color:'#f59e0b', marginLeft:8 }}>⬆ LEVEL UP!</span>}
                  </div>
                )}
                {result?.explanation && (
                  <div style={{ marginTop:'1rem', color:'#94a3b8', fontFamily:'Rajdhani', lineHeight:1.6,
                    borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'1rem' }}>
                    <span style={{ color:'#6366f1', fontWeight:700 }}>💡 Explanation: </span>
                    {result.explanation}
                  </div>
                )}
              </div>

              {/* New badges */}
              {result?.newBadges?.length > 0 && (
                <div style={{ marginBottom:'1rem' }}>
                  {result.newBadges.map((b, i) => (
                    <div key={i} style={{
                      background:'rgba(168,85,247,0.1)', border:'1px solid rgba(168,85,247,0.3)',
                      borderRadius:10, padding:'0.75rem 1rem', display:'flex', alignItems:'center', gap:8
                    }}>
                      <span style={{ fontSize:'1.5rem' }}>{b.icon}</span>
                      <div>
                        <div style={{ color:'#a855f7', fontFamily:'Orbitron', fontSize:'0.8rem' }}>BADGE UNLOCKED!</div>
                        <div style={{ color:'#e2e8f0', fontFamily:'Rajdhani' }}>{b.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
                <Link to={`/topics/${puzzle.topicId}`} className="btn-outline no-underline" style={{ flex:1, textAlign:'center', padding:'1rem' }}>
                  ← BACK TO TOPIC
                </Link>
                <Link to="/topics" className="btn-primary no-underline" style={{ flex:1, textAlign:'center', padding:'1rem' }}>
                  MORE TOPICS →
                </Link>
              </div>
            </div>
          )}

          {/* Hint */}
          {showHint && puzzle.hints?.length > 0 && (
            <div style={{
              marginTop:'1rem', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)',
              borderRadius:10, padding:'1rem'
            }}>
              <span style={{ color:'#f59e0b', fontFamily:'Orbitron', fontSize:'0.75rem' }}>💡 HINT: </span>
              <span style={{ color:'#94a3b8', fontFamily:'Rajdhani' }}>{puzzle.hints[hintIndex]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuzzlePage;
