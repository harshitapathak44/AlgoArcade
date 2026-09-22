// ============================================================
// User Model - Schema for AlgoArcade players
// ============================================================
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const BadgeSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  icon:        { type: String, default: '🏆' },
  description: { type: String },
  earnedAt:    { type: Date, default: Date.now }
});

const TopicProgressSchema = new mongoose.Schema({
  topicId:       { type: String, required: true },
  topicName:     { type: String, required: true },
  levelsUnlocked: { type: Number, default: 1 },
  totalSolved:   { type: Number, default: 0 },
  completed:     { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false  // Never return password in queries
  },
  avatar: {
    type: String,
    default: 'pixel-wizard' // Default avatar style
  },
  totalScore:   { type: Number, default: 0 },
  level:        { type: Number, default: 1 },
  xp:           { type: Number, default: 0 },
  streak:       { type: Number, default: 0 },
  lastActive:   { type: Date, default: Date.now },
  badges:       [BadgeSchema],
  topicProgress: [TopicProgressSchema],
  solvedPuzzles: [{ type: String }],  // Array of puzzle IDs solved
  rank:         { type: String, default: 'Novice Coder' }
}, {
  timestamps: true
});

// ── Pre-save: hash password ───────────────────────────────────
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Method: compare passwords ─────────────────────────────────
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ── Method: calculate rank from level ────────────────────────
UserSchema.methods.updateRank = function () {
  const ranks = [
    { level: 1,  rank: 'Novice Coder' },
    { level: 5,  rank: 'Bit Flipper' },
    { level: 10, rank: 'Stack Overflow' },
    { level: 15, rank: 'Queue Master' },
    { level: 20, rank: 'Tree Climber' },
    { level: 25, rank: 'Graph Walker' },
    { level: 30, rank: 'Algorithm Wizard' },
    { level: 40, rank: 'Data Structure Sage' },
    { level: 50, rank: 'Code Overlord' }
  ];
  const current = [...ranks].reverse().find(r => this.level >= r.level);
  this.rank = current ? current.rank : 'Novice Coder';
};

module.exports = mongoose.model('User', UserSchema);
