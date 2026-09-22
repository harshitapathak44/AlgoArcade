// ============================================================
// Auth Routes - /api/auth
// ============================================================
const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const { generateToken } = require('../middleware/auth');

// ── POST /api/auth/register ───────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already in use' : 'Username already taken'
      });
    }

    // Create user (password hashed via pre-save hook)
    const user = await User.create({ username, email, password });

    // Award starter badge
    user.badges.push({
      name: 'First Login',
      icon: '🌟',
      description: 'Welcome to AlgoArcade!'
    });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        level: user.level,
        xp: user.xp,
        totalScore: user.totalScore,
        rank: user.rank,
        badges: user.badges,
        topicProgress: user.topicProgress
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Update last active & streak
    const now = new Date();
    const lastActive = user.lastActive;
    const hoursDiff = (now - lastActive) / (1000 * 60 * 60);
    if (hoursDiff >= 20 && hoursDiff <= 48) {
      user.streak += 1;  // Consecutive day login
    } else if (hoursDiff > 48) {
      user.streak = 1;   // Streak broken
    }
    user.lastActive = now;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: `Welcome back, ${user.username}! 🎮`,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        level: user.level,
        xp: user.xp,
        totalScore: user.totalScore,
        rank: user.rank,
        streak: user.streak,
        badges: user.badges,
        topicProgress: user.topicProgress,
        solvedPuzzles: user.solvedPuzzles
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────
const { protect } = require('../middleware/auth');
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
