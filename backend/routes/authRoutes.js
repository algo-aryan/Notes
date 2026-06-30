const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login via Local Strategy
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: 'Logged in successfully', user: { id: user._id, name: user.name, email: user.email } });
    });
  })(req, res, next);
});

// Get current user info
router.get('/current-user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email } });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Logout
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'Logged out successfully' });
  });
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: 'https://notes-teal-ten.vercel.app/index.html'
}), (req, res) => {
  res.redirect('https://notes-teal-ten.vercel.app/dashboard.html');
});

module.exports = router;
