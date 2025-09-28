// routes/admin.js - Admin routes
const express = require('express');
const router = express.Router();
const {
  getUsers,
  getPendingMentors,
  approveMentor,
  rejectMentor,
  getResources,
  verifyResource,
  getStats
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// All admin routes require authentication and admin role
router.use(protect, authorize('Admin'));

// Users management
router.get('/users', getUsers);

// Mentors management
router.get('/mentors/pending', getPendingMentors);
router.put('/mentors/:id/approve', approveMentor);
router.put('/mentors/:id/reject', rejectMentor);

// Resources management
router.get('/resources', getResources);
router.put('/resources/:id/verify', verifyResource);

// Dashboard stats
router.get('/stats', getStats);

module.exports = router;
