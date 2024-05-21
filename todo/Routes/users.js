const express = require('express');
const router = express.Router();
const UserService = require('../models/user.service');


// Registration form
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle registration
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      throw new Error('All fields are required');
    }

    // Register the user
    await UserService.registerUser(username, password);
    res.redirect('/login');
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(400).render('register', { error: error.message });
  }
});

module.exports = router;

