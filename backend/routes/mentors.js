// routes/mentors.js - Mentor routes
const express = require('express');
const router = express.Router();
const {
  registerMentor,
  getMentors,
  getMentor,
  bookSession,
  getSessions
} = require('../controllers/mentorController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Get all mentors (public)
router.get('/', getMentors);

// Get single mentor (public)
router.get('/:id', getMentor);

// Register as mentor (protected, Mentor role)
router.post('/register', protect, authorize('Mentor'), registerMentor);

// Book session (protected, Student)
router.post('/:id/book', protect, authorize('Student'), bookSession);

// Get user sessions (protected)
router.get('/sessions/all', protect, getSessions);

module.exports = router;
