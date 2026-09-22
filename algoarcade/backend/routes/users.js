// ============================================================
// Users Routes - /api/users
// ============================================================
const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

// ── GET /api/users/profile - Get current user's profile ──────
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/users/profile - Update profile ───────────────────
router.put('/profile', protect, async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (username) user.username = username;
    if (avatar) user.avatar = avatar;

    await user.save();
    res.json({ success: true, message: 'Profile updated!', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/users/progress - Get progress stats ──────────────
router.get('/progress', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      progress: {
        level: user.level,
        xp: user.xp,
        xpToNextLevel: (user.level * 500) - user.xp,
        totalScore: user.totalScore,
        rank: user.rank,
        streak: user.streak,
        badges: user.badges,
        topicProgress: user.topicProgress,
        totalSolved: user.solvedPuzzles.length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
