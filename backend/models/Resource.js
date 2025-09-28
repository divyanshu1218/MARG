// models/Resource.js - Knowledge hub resource schema
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  type: {
    type: String,
    enum: ['article', 'guide', 'video', 'pdf'],
    default: 'article'
  },
  category: {
    type: String,
    enum: ['engineering', 'medicine', 'government-exams', 'arts', 'commerce', 'science', 'other'],
    required: true
  },
  tags: [{
    type: String
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  source: {
    type: String,
    enum: ['User', 'Government', 'Verified-Institution', 'NGO'],
    default: 'User'
  },
  governmentSource: {
    type: String, // e.g., 'UGC', 'AICTE', 'NSP', 'AISHE'
    trim: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  externalUrl: {
    type: String // For external links or video URLs
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
resourceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for searching resources
resourceSchema.index({ title: 'text', content: 'text' });
resourceSchema.index({ category: 1 });
resourceSchema.index({ tags: 1 });

module.exports = mongoose.model('Resource', resourceSchema);
