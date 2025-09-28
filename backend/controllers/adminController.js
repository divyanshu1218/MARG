// controllers/adminController.js - Admin controller
const User = require('../models/User');
const Mentor = require('../models/Mentor');
const Resource = require('../models/Resource');
const Session = require('../models/Session');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;

    let query = {};
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      users
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get pending mentors
// @route   GET /api/admin/mentors/pending
// @access  Private (Admin)
const getPendingMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({ isVetted: false }).populate('user', 'name email');

    res.json({
      success: true,
      count: mentors.length,
      mentors
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Approve mentor
// @route   PUT /api/admin/mentors/:id/approve
// @access  Private (Admin)
const approveMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    mentor.isVetted = true;
    await mentor.save();

    res.json({
      success: true,
      message: 'Mentor approved successfully',
      mentor
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reject mentor
// @route   PUT /api/admin/mentors/:id/reject
// @access  Private (Admin)
const rejectMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    await Mentor.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Mentor rejected and removed'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all resources for moderation
// @route   GET /api/admin/resources
// @access  Private (Admin)
const getResources = async (req, res) => {
  try {
    const { verified, page = 1, limit = 10 } = req.query;

    let query = {};
    if (verified !== undefined) {
      query.isVerified = verified === 'true';
    }

    const resources = await Resource.find(query)
      .populate('author', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Resource.countDocuments(query);

    res.json({
      success: true,
      count: resources.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      resources
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify resource
// @route   PUT /api/admin/resources/:id/verify
// @access  Private (Admin)
const verifyResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    resource.isVerified = true;
    await resource.save();

    res.json({
      success: true,
      message: 'Resource verified successfully',
      resource
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMentors = await Mentor.countDocuments({ isVetted: true });
    const pendingMentors = await Mentor.countDocuments({ isVetted: false });
    const totalResources = await Resource.countDocuments();
    const verifiedResources = await Resource.countDocuments({ isVerified: true });
    const totalSessions = await Session.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalMentors,
        pendingMentors,
        totalResources,
        verifiedResources,
        totalSessions
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUsers,
  getPendingMentors,
  approveMentor,
  rejectMentor,
  getResources,
  verifyResource,
  getStats
};
