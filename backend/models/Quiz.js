// models/Quiz.js - Aptitude quiz schema
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [String], // Multiple choice options
    category: {
      type: String,
      enum: ['Interest', 'Strength', 'Value', 'Aptitude']
    },
    weight: {
      type: Number,
      default: 1
    }
  }],
  responses: [{
    questionIndex: Number,
    answer: mongoose.Schema.Types.Mixed, // Can be string or array for multiple answers
    score: Number
  }],
  results: {
    careerClusters: [{
      cluster: String, // e.g., 'Engineering', 'Medical'
      score: Number,
      percentage: Number
    }],
    recommendedCareers: [String],
    strengths: [String],
    suggestions: [String]
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
quizSchema.index({ userId: 1, isCompleted: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
