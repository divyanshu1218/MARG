// digilockerAuth.js - DigiLocker OAuth2 authentication (template)
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const User = require('../models/User');
const { generateToken } = require('../config/jwt');

passport.use('digilocker', new OAuth2Strategy({
    authorizationURL: 'https://digilocker.gov.in/oauth/authorize',
    tokenURL: 'https://digilocker.gov.in/oauth/token',
    clientID: process.env.DIGILOCKER_CLIENT_ID,
    clientSecret: process.env.DIGILOCKER_CLIENT_SECRET,
    callbackURL: '/api/auth/digilocker/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    // You need to fetch user info from DigiLocker API using accessToken
    // For demo, we'll use a placeholder
    try {
      let user = await User.findOne({ email: profile.email });
      if (!user) {
        user = await User.create({
          name: profile.name,
          email: profile.email,
          role: 'Student',
          isVerified: true
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;
