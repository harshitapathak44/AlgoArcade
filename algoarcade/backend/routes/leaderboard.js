// ============================================================
// Leaderboard Routes - /api/leaderboard
// ============================================================
const express = require('express');
const router  = express.Router();
const User    = require('../models/User');

// ── GET /api/leaderboard - Top players by score ───────────────
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const leaders = await User.find()
      .select('username totalScore level xp rank badges streak createdAt')
      .sort({ totalScore: -1 })
      .limit(limit);

    const leaderboard = leaders.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      totalScore: user.totalScore,
      level: user.level,
      xp: user.xp,
      rankTitle: user.rank,
      badgeCount: user.badges.length,
      streak: user.streak,
      topBadge: user.badges[user.badges.length - 1] || null
    }));

    res.json({ success: true, leaderboard });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
