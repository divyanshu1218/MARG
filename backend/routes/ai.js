// routes/ai.js - AI routes
const express = require('express');
const router = express.Router();
const { chat, recommend } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// All AI routes require authentication
router.post('/chat', protect, chat);
router.post('/recommend', protect, recommend);

module.exports = router;
