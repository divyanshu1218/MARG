// models/Session.js - Booking session schema for mentorship
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String, // e.g., '10:00 AM'
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  sessionType: {
    type: String,
    enum: ['chat', 'video', 'qna'],
    default: 'chat'
  },
  roomId: {
    type: String // For Socket.io chat room
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    givenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    givenAt: Date
  },
  notes: {
    type: String,
    maxlength: 500
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
sessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Session', sessionSchema);
