const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  id:                { type: String, required: true, unique: true },
  name:              { type: String, required: true },
  description:       { type: String, default: '' },
  icon:              { type: String, default: '📦' },
  color:             { type: String, default: '#6366f1' },
  difficulty:        { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  totalLevels:       { type: Number, default: 5 },
  order:             { type: Number, default: 0 },
  unlockRequirement: { type: Number, default: 0 }
}, { timestamps: true });

const PuzzleSchema = new mongoose.Schema({
  topicId:       { type: String,  required: true },
  title:         { type: String,  required: true },
  description:   { type: String,  default: '' },
  level:         { type: Number,  required: true, min: 1 },
  difficulty:    { type: String,  enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  type:          { type: String,  enum: ['multiple-choice', 'code-trace', 'fill-blank', 'order-steps'], default: 'multiple-choice' },
  question:      { type: String,  required: true },
  options:       [{ type: String }],
  correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
  explanation:   { type: String,  default: '' },
  xpReward:      { type: Number,  default: 50 },
  scoreReward:   { type: Number,  default: 100 },
  hints:         [{ type: String }],
  tags:          [{ type: String }]
}, { timestamps: true });

const Topic  = mongoose.model('Topic',  TopicSchema);
const Puzzle = mongoose.model('Puzzle', PuzzleSchema);

module.exports = { Topic, Puzzle };