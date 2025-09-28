// models/User.js - User schema
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: false, // Password not required for OAuth users
    minlength: 6,
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['Student', 'Mentor', 'Teacher', 'Institution', 'Admin'],
    default: 'Student'
  },
  bio: {
    type: String,
    maxlength: 500
  },
  // Student-specific fields
  class: {
    type: String, // e.g., '10', '12', 'College 1st Year'
    trim: true
  },
  board: {
    type: String, // e.g., 'CBSE', 'ICSE', 'State Board'
    trim: true
  },
  subjects: [String], // e.g., ['Math', 'Physics', 'Chemistry']
  grades: {
    type: Map,
    of: String // e.g., {'Math': 'A', 'Physics': 'B+'}
  },
  careerInterests: [String], // e.g., ['Engineering', 'Medical', 'Law']
  // Mentor-specific fields
  expertise: [String],
  hourlyRate: Number,
  isVetted: {
    type: Boolean,
    default: false
  },
  availability: [String], // e.g., ['Mon 10-12', 'Wed 2-4']
  // Teacher/Institution-specific fields
  institutionName: {
    type: String,
    trim: true
  },
  institutionType: {
    type: String,
    enum: ['School', 'College', 'Coaching', 'NGO', 'Other']
  },
  studentsManaged: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Common fields
  education: {
    type: String,
    maxlength: 200
  },
  location: {
    type: String
  },
  phone: {
    type: String,
    trim: true
  },
  language: {
    type: String,
    default: 'English' // For multilingual support
  },
  interests: [{
    type: String
  }],
  scores: {
    type: Object // For career recommendation inputs
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profilePicture: {
    type: String // URL to profile picture
  },
  lastSync: {
    type: Date // For offline sync tracking
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving (only if password exists)
userSchema.pre('save', async function(next) {
  if (!this.password || !this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method (only if password exists)
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
