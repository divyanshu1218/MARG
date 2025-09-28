// routes/auth.js - Authentication routes
const express = require('express');
const router = express.Router();
const { login, getProfile, updateProfile } = require('../controllers/authController');
const googlePassport = require('../config/googleAuth');
const digilockerPassport = require('../config/digilockerAuth');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/login', login);

// Google OAuth
router.get('/google', googlePassport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', googlePassport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
	// Send JWT token to frontend
	const token = require('../config/jwt').generateToken({ id: req.user._id });
	res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
});

// DigiLocker OAuth
router.get('/digilocker', digilockerPassport.authenticate('digilocker'));
router.get('/digilocker/callback', digilockerPassport.authenticate('digilocker', { failureRedirect: '/' }), (req, res) => {
	// Send JWT token to frontend
	const token = require('../config/jwt').generateToken({ id: req.user._id });
	res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
});

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
