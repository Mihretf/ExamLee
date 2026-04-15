const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

router.post('/signup', async (req, res) => {
  try {
    console.log("Incoming Data:", req.body);

    // Explicitly pull everything out
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const department = req.body.department;
    const student_year = req.body.student_year;
    const role = req.body.role || 'student'; // Fallback to student if empty

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await authService.register(
      username, 
      email, 
      password, 
      department, 
      student_year,
      role 
    );
    
    // Using user.role (from the DB response) is safer than the 'role' variable
    res.status(201).json({ 
      message: `${user.role} registered successfully!`, 
      user 
    });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(400).json({ error: err.message });
  }
});

// Login remains the same...
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Call the login method from our service
    const data = await authService.login(email, password);
    
    // If successful, send back the token and user info
    res.json({
      message: "Login successful!",
      token: data.token,
      user: {
        id: data.user.id,
        username: data.user.username,
        role: data.user.role,
        department: data.user.department,
        student_year: data.user.student_year
      }
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;