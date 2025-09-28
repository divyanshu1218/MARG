const Session = require('../models/Session');
const User = require('../models/User');
const Mentor = require('../models/Mentor');

// Get all sessions for a user
const getUserSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    let sessions;
    if (user.role === 'Student') {
      sessions = await Session.find({ student: userId })
        .populate('mentor', 'user expertise hourlyRate')
        .populate('student', 'name email')
        .sort({ date: -1 });
    } else if (user.role === 'Mentor') {
      const mentor = await Mentor.findOne({ user: userId });
      if (mentor) {
        sessions = await Session.find({ mentor: mentor._id })
          .populate('student', 'name email')
          .populate('mentor', 'user expertise hourlyRate')
          .sort({ date: -1 });
      } else {
        return res.status(404).json({ success: false, message: 'Mentor profile not found' });
      }
    } else {
      // Admin can see all
      sessions = await Session.find({})
        .populate('student', 'name email')
        .populate('mentor', 'user expertise hourlyRate')
        .sort({ date: -1 });
    }

    res.json({ success: true, count: sessions.length, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get session by ID
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('student', 'name email')
      .populate('mentor', 'user expertise hourlyRate experience qualifications')
      .populate('feedback.givenBy', 'name');

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Check if user is authorized to view this session
    const userId = req.user.id;
    const user = await User.findById(userId);
    const isStudent = session.student._id.toString() === userId;
    const mentor = await Mentor.findOne({ user: userId });
    const isMentor = mentor && session.mentor._id.toString() === mentor._id.toString();
    const isAdmin = user.role === 'Admin';

    if (!isStudent && !isMentor && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Book a session
const bookSession = async (req, res) => {
  try {
    const { mentorId, date, time, duration, notes } = req.body;
    const studentId = req.user.id;

    // Validate mentor exists and is active
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }

    // Check if student already has a session with this mentor on the same date/time
    const existingSession = await Session.findOne({
      student: studentId,
      mentor: mentorId,
      date: new Date(date),
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingSession) {
      return res.status(400).json({ success: false, message: 'Session already exists for this time' });
    }

    const session = new Session({
      student: studentId,
      mentor: mentorId,
      date: new Date(date),
      time,
      duration: duration || 60,
      notes,
      roomId: `session_${Date.now()}`
    });

    await session.save();

    await session.populate('student', 'name email');
    await session.populate('mentor', 'user expertise hourlyRate');

    res.status(201).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update session status
const updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const sessionId = req.params.id;
    const userId = req.user.id;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Check permissions
    const user = await User.findById(userId);
    const isStudent = session.student.toString() === userId;
    const mentor = await Mentor.findOne({ user: userId });
    const isMentor = mentor && session.mentor.toString() === mentor._id.toString();
    const isAdmin = user.role === 'Admin';

    if (!isStudent && !isMentor && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Validate status transition
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    session.status = status;
    if (status === 'completed') {
      session.updatedAt = new Date();
    }

    await session.save();

    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Cancel session
const cancelSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user.id;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Check permissions
    const user = await User.findById(userId);
    const isStudent = session.student.toString() === userId;
    const mentor = await Mentor.findOne({ user: userId });
    const isMentor = mentor && session.mentor.toString() === mentor._id.toString();
    const isAdmin = user.role === 'Admin';

    if (!isStudent && !isMentor && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Only allow cancellation if not completed
    if (session.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel completed session' });
    }

    session.status = 'cancelled';
    await session.save();

    res.json({ success: true, message: 'Session cancelled', session });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Add feedback
const addFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const sessionId = req.params.id;
    const userId = req.user.id;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Only student can give feedback
    if (session.student.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Only student can give feedback' });
    }

    // Only for completed sessions
    if (session.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only give feedback for completed sessions' });
    }

    session.feedback = {
      rating,
      comment,
      givenBy: userId,
      givenAt: new Date()
    };

    await session.save();

    res.json({ success: true, message: 'Feedback added', session });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUserSessions,
  getSessionById,
  bookSession,
  updateSessionStatus,
  cancelSession,
  addFeedback
};
