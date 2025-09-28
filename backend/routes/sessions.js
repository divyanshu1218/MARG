const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Get all sessions for a user
router.get('/', protect, sessionController.getUserSessions);

// Get session by ID
router.get('/:id', protect, sessionController.getSessionById);

// Book a session
router.post('/book', protect, authorize(['Student']), sessionController.bookSession);

// Update session status
router.put('/:id/status', protect, sessionController.updateSessionStatus);

// Cancel session
router.put('/:id/cancel', protect, sessionController.cancelSession);

// Add feedback
router.post('/:id/feedback', protect, sessionController.addFeedback);

module.exports = router;
