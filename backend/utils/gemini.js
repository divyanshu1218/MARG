// utils/gemini.js - Google Gemini API integration
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

const generateResponse = async (prompt) => {
  try {
    const response = await axios.post(GEMINI_API_URL, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    throw new Error('Failed to generate AI response');
  }
};

const generateCareerRecommendation = async (userData) => {
  const prompt = `Based on the following student information, provide career recommendations:
  Name: ${userData.name}
  Education: ${userData.education}
  Interests: ${userData.interests?.join(', ')}
  Location: ${userData.location}
  Scores/Grades: ${JSON.stringify(userData.scores)}
  
  Please provide 3-5 career options with brief explanations.`;

  return await generateResponse(prompt);
};

const chatWithAI = async (message, context = []) => {
  const conversation = context.map(msg => `${msg.role}: ${msg.content}`).join('\n');
  const prompt = `${conversation}\nUser: ${message}\nAI:`;

  return await generateResponse(prompt);
};

module.exports = {
  generateResponse,
  generateCareerRecommendation,
  chatWithAI
};
