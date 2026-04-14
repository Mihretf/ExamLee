const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, department, student_year } = req.body;
    
    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await authService.register(
      username, 
      email, 
      password, 
      department, 
      student_year
    );
    
    res.status(201).json({ message: "Student registered successfully!", user });
  } catch (err) {
    // Handle duplicate email/username errors specifically
    if (err.code === '23505') {
      return res.status(400).json({ error: "Username or Email already exists" });
    }
    res.status(400).json({ error: err.message });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Call the login method from our service
    const data = await authService.login(email, password);
    
    // If successful, send back the token and user info
    res.json({
      message: "Login successful!",
      token: data.token,
      user: data.user
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;