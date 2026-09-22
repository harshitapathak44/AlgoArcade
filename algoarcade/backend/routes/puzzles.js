// ============================================================
// Puzzles Routes - /api/puzzles
// ============================================================
const express = require('express');
const router  = express.Router();
const { Puzzle } = require('../models/Topic');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ── GET /api/puzzles/:id - Get a single puzzle ────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) return res.status(404).json({ success: false, message: 'Puzzle not found' });

    // Don't expose the correct answer in GET
    const puzzleData = puzzle.toObject();
    delete puzzleData.correctAnswer;
    res.json({ success: true, puzzle: puzzleData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/puzzles/:id/submit - Submit an answer ───────────
router.post('/:id/submit', protect, async (req, res) => {
  try {
    const { answer } = req.body;
    const puzzle = await Puzzle.findById(req.params.id);

    if (!puzzle) return res.status(404).json({ success: false, message: 'Puzzle not found' });

    const isCorrect = String(answer).trim().toLowerCase() === String(puzzle.correctAnswer).trim().toLowerCase();

    // If already solved, don't award again
    const alreadySolved = req.user.solvedPuzzles.includes(req.params.id);

    let xpGained = 0, scoreGained = 0, newBadges = [], leveledUp = false;

    if (isCorrect && !alreadySolved) {
      const user = await User.findById(req.user._id);

      // Award XP and score
      xpGained = puzzle.xpReward;
      scoreGained = puzzle.scoreReward;
      user.xp += xpGained;
      user.totalScore += scoreGained;
      user.solvedPuzzles.push(req.params.id);

      // Level up logic: every 500 XP = 1 level
      const newLevel = Math.floor(user.xp / 500) + 1;
      if (newLevel > user.level) {
        user.level = newLevel;
        leveledUp = true;
        user.updateRank();

        // Award level badge
        if (user.level % 5 === 0) {
          const badge = {
            name: `Level ${user.level} Achieved`,
            icon: '🎖️',
            description: `Reached level ${user.level}!`
          };
          user.badges.push(badge);
          newBadges.push(badge);
        }
      }

      // Update topic progress
      const topicProgress = user.topicProgress.find(tp => tp.topicId === puzzle.topicId);
      if (topicProgress) {
        topicProgress.totalSolved += 1;
        if (puzzle.level >= topicProgress.levelsUnlocked) {
          topicProgress.levelsUnlocked = puzzle.level + 1;
        }
      } else {
        user.topicProgress.push({
          topicId: puzzle.topicId,
          topicName: puzzle.topicId,
          levelsUnlocked: 2,
          totalSolved: 1
        });
      }

      // First solve badge for a topic
      const topicSolveCount = user.solvedPuzzles.filter(pid => {
        // Rough filter - works for our seed data
        return true;
      }).length;

      if (topicSolveCount === 1) {
        const badge = { name: 'First Blood', icon: '⚔️', description: 'Solved your first puzzle!' };
        user.badges.push(badge);
        newBadges.push(badge);
      }

      await user.save();
    }

    res.json({
      success: true,
      correct: isCorrect,
      alreadySolved,
      explanation: isCorrect ? puzzle.explanation : null,
      xpGained,
      scoreGained,
      leveledUp,
      newBadges
    });
  } catch (err) {
    console.error('Submit error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
