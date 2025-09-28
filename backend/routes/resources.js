// routes/resources.js - Resource routes
const express = require('express');
const router = express.Router();
const {
  createResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
  likeResource
} = require('../controllers/resourceController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Public routes
router.get('/', getResources);
router.get('/:id', getResource);

// Protected routes
router.post('/', protect, authorize('Teacher', 'Admin'), createResource);
router.put('/:id', protect, updateResource);
router.put('/:id/like', protect, likeResource);

// Admin only
router.delete('/:id', protect, authorize('Admin'), deleteResource);

module.exports = router;
