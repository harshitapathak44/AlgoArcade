// ============================================================
// LeaderboardPage - Global rankings
// ============================================================
import React, { useState, useEffect } from 'react';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };
const RANK_COLORS = { 1: '#f59e0b', 2: '#94a3b8', 3: '#b45309' };

const LeaderboardPage = () => {
  const { user }       = useAuth();
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/leaderboard?limit=20')
      .then(r => setBoard(r.data.leaderboard || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const myRank = board.find(e => e.username === user?.username);

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0f', padding:'90px 1rem 3rem' }}>
      <div style={{ maxWidth: 800, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ fontSize:'3rem', marginBottom:'0.5rem' }}>🏆</div>
          <h1 className="font-display" style={{ fontSize:'clamp(1.5rem,4vw,2.5rem)', fontWeight:900,
            background:'linear-gradient(135deg,#f59e0b,#ef4444)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            HALL OF FAME
          </h1>
          <p style={{ color:'#64748b', fontFamily:'Rajdhani', marginTop:4 }}>
            Top 20 Algorithm Warriors ranked by score
          </p>
        </div>

        {/* My rank banner */}
        {myRank && (
          <div style={{
            background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.3)',
            borderRadius:12, padding:'1rem 1.5rem', marginBottom:'1.5rem',
            display:'flex', alignItems:'center', gap:'1rem'
          }}>
            <div className="font-display" style={{ color:'#6366f1', fontSize:'1.2rem', fontWeight:900 }}>
              #{myRank.rank}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ color:'#e2e8f0', fontFamily:'Rajdhani', fontWeight:700 }}>Your Ranking</div>
              <div style={{ color:'#64748b', fontFamily:'Rajdhani', fontSize:'0.85rem' }}>
                Score: {myRank.totalScore} · Level {myRank.level}
              </div>
            </div>
            <div style={{ color:'#a855f7', fontFamily:'Rajdhani', fontSize:'0.85rem' }}>
              {myRank.rankTitle}
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div style={{ textAlign:'center', padding:'4rem', color:'#64748b', fontFamily:'Rajdhani' }}>
            ⏳ Loading leaderboard...
          </div>
        ) : board.length === 0 ? (
          <div style={{ textAlign:'center', padding:'4rem' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🎮</div>
            <div style={{ color:'#64748b', fontFamily:'Rajdhani', fontSize:'1.1rem' }}>
              No players yet. Be the first!
            </div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
            {board.map((entry, i) => {
              const isMe = entry.username === user?.username;
              return (
                <div key={i} style={{
                  background: isMe ? 'rgba(99,102,241,0.08)' : '#1a1a2e',
                  border:`1px solid ${isMe ? 'rgba(99,102,241,0.4)' : '#2a2a4a'}`,
                  borderRadius:12, padding:'1rem 1.5rem',
                  display:'flex', alignItems:'center', gap:'1rem',
                  transition:'all 0.2s',
                  animation:`fadeInUp 0.4s ease ${i * 0.05}s both`
                }}>
                  {/* Rank */}
                  <div style={{ width:40, textAlign:'center', flexShrink:0 }}>
                    {entry.rank <= 3 ? (
                      <span style={{ fontSize:'1.5rem' }}>{MEDAL[entry.rank]}</span>
                    ) : (
                      <span className="font-display" style={{ color: RANK_COLORS[entry.rank] || '#64748b', fontSize:'0.9rem' }}>
                        #{entry.rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div style={{
                    width:40, height:40, borderRadius:'50%', flexShrink:0,
                    background:`linear-gradient(135deg, ${entry.rank<=3 ? '#f59e0b' : '#6366f1'}, #a855f7)`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:'Orbitron', fontWeight:900, color:'white', fontSize:'0.9rem',
                    boxShadow:entry.rank<=3 ? `0 0 12px ${RANK_COLORS[entry.rank] || '#f59e0b'}80` : 'none'
                  }}>
                    {entry.username[0].toUpperCase()}
                  </div>

                  {/* Name & rank */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                      <span style={{ color:'#e2e8f0', fontFamily:'Rajdhani', fontWeight:700, fontSize:'1rem' }}>
                        {entry.username}
                      </span>
                      {isMe && <span className="badge badge-purple" style={{ fontSize:'0.65rem' }}>YOU</span>}
                    </div>
                    <div style={{ color:'#64748b', fontFamily:'Rajdhani', fontSize:'0.8rem' }}>
                      {entry.rankTitle} · Level {entry.level}
                      {entry.streak > 1 && <span style={{ color:'#ef4444', marginLeft:8 }}>🔥 {entry.streak}d</span>}
                    </div>
                  </div>

                  {/* Score */}
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div className="font-display" style={{
                      color: entry.rank === 1 ? '#f59e0b' : entry.rank === 2 ? '#94a3b8' : entry.rank === 3 ? '#b45309' : '#6366f1',
                      fontSize:'1.1rem', fontWeight:900
                    }}>
                      {entry.totalScore.toLocaleString()}
                    </div>
                    <div style={{ color:'#64748b', fontFamily:'Rajdhani', fontSize:'0.75rem' }}>
                      {entry.xp} XP · {entry.badgeCount} 🏅
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
