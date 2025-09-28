// controllers/aiController.js - AI controller
const { chatWithAI, generateCareerRecommendation } = require('../utils/gemini');

// @desc    AI Chat
// @route   POST /api/ai/chat
// @access  Private
const chat = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const response = await chatWithAI(message, context || []);

    res.json({
      success: true,
      response
    });
  } catch (error) {
    res.status(500).json({ message: 'AI service error', error: error.message });
  }
};

// @desc    Career Recommendation
// @route   POST /api/ai/recommend
// @access  Private
const recommend = async (req, res) => {
  try {
    const userData = {
      name: req.user.name,
      education: req.user.education,
      interests: req.user.interests,
      location: req.user.location,
      scores: req.user.scores
    };

    const recommendation = await generateCareerRecommendation(userData);

    res.json({
      success: true,
      recommendation
    });
  } catch (error) {
    res.status(500).json({ message: 'Recommendation service error', error: error.message });
  }
};

module.exports = {
  chat,
  recommend
};
