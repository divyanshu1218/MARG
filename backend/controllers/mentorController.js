// controllers/mentorController.js - Mentor controller
const Mentor = require('../models/Mentor');
const Session = require('../models/Session');
const User = require('../models/User');

// @desc    Register as mentor
// @route   POST /api/mentors/register
// @access  Private (Mentor role)
const registerMentor = async (req, res) => {
  try {
    const { expertise, experience, qualifications, availability, hourlyRate, languages, specializations } = req.body;

    // Check if already a mentor
    const existingMentor = await Mentor.findOne({ user: req.user._id });
    if (existingMentor) {
      return res.status(400).json({ message: 'Already registered as mentor' });
    }

    const mentor = await Mentor.create({
      user: req.user._id,
      expertise,
      experience,
      qualifications,
      availability,
      hourlyRate,
      languages,
      specializations
    });

    res.status(201).json({
      success: true,
      mentor
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all mentors
// @route   GET /api/mentors
// @access  Private
const getMentors = async (req, res) => {
  try {
    const { expertise, category } = req.query;

    let query = { isVetted: true };

    if (expertise) {
      query.expertise = { $in: [expertise] };
    }

    if (category) {
      query.specializations = { $in: [category] };
    }

    const mentors = await Mentor.find(query).populate('user', 'name email bio profilePicture');

    res.json({
      success: true,
      count: mentors.length,
      mentors
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get mentor by ID
// @route   GET /api/mentors/:id
// @access  Private
const getMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id).populate('user', 'name email bio education profilePicture');

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.json({
      success: true,
      mentor
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Book session
// @route   POST /api/mentors/:id/book
// @access  Private (Student)
const bookSession = async (req, res) => {
  try {
    const { date, time, duration, notes } = req.body;
    const mentorId = req.params.id;

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const session = await Session.create({
      student: req.user._id,
      mentor: mentorId,
      date,
      time,
      duration,
      notes,
      roomId: `room_${req.user._id}_${mentorId}_${Date.now()}`
    });

    res.status(201).json({
      success: true,
      session
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user sessions
// @route   GET /api/mentors/sessions
// @access  Private
const getSessions = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'Student') {
      query.student = req.user._id;
    } else if (req.user.role === 'Mentor') {
      const mentor = await Mentor.findOne({ user: req.user._id });
      if (mentor) {
        query.mentor = mentor._id;
      }
    }

    const sessions = await Session.find(query)
      .populate('student', 'name email')
      .populate('mentor', 'user')
      .populate({
        path: 'mentor',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .sort({ date: 1 });

    res.json({
      success: true,
      sessions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerMentor,
  getMentors,
  getMentor,
  bookSession,
  getSessions
};
