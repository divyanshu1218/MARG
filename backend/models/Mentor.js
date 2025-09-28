// models/Mentor.js - Mentor schema
const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  expertise: [{
    type: String,
    required: true
  }],
  experience: {
    type: String,
    maxlength: 500
  },
  qualifications: [{
    type: String
  }],
  availability: {
    type: Object, // e.g., { monday: ['9-11', '2-4'], tuesday: [...] }
  },
  hourlyRate: {
    type: Number,
    min: 0
  },
  isVetted: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  languages: [{
    type: String
  }],
  specializations: [{
    type: String // e.g., engineering, medicine, government exams
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for searching mentors by expertise
mentorSchema.index({ expertise: 1, isVetted: 1 });

module.exports = mongoose.model('Mentor', mentorSchema);
