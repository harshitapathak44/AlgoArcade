// ============================================================
// Topics Routes - /api/topics
// ============================================================
const express = require('express');
const router  = express.Router();
const { Topic, Puzzle } = require('../models/Topic');
const { protect } = require('../middleware/auth');

// ── GET /api/topics - Get all DSA topics ──────────────────────
router.get('/', async (req, res) => {
  try {
    const topics = await Topic.find().sort({ order: 1 });
    res.json({ success: true, topics });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/topics/:id - Get single topic ────────────────────
router.get('/:id', async (req, res) => {
  try {
    const topic = await Topic.findOne({ id: req.params.id });
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });

    // Get puzzles for this topic
    const puzzles = await Puzzle.find({ topicId: req.params.id }).sort({ level: 1 });

    res.json({ success: true, topic, puzzles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/topics/:id/puzzles?level=N ───────────────────────
router.get('/:id/puzzles', protect, async (req, res) => {
  try {
    const { level } = req.query;
    const query = { topicId: req.params.id };
    if (level) query.level = parseInt(level);

    const puzzles = await Puzzle.find(query).sort({ level: 1 });
    res.json({ success: true, puzzles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
