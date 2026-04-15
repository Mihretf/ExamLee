const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('../routes/auth.routes');

const authService = {
  // Updated to include department and student_year
  register: async (username, email, password, department, student_year) => {
    // 1. Hash the password (Security first!)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Insert into DB with the new columns
    const query = `
      INSERT INTO users (username, email, password_hash, department, student_year) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, username, email, department, student_year
    `;
    
    const result = await pool.query(query, [
      username, 
      email, 
      hashedPassword, 
      department, 
      student_year
    ]);

    return result.rows[0];
  },
  
  // Login stays mostly the same, but you might want to return the year/dept too
  login: async (email, password) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { 
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        department: user.department,
        student_year: user.student_year
      } 
    };
  }
};

module.exports = authService;