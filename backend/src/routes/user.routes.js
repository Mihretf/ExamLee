const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Your database connection
const { protect } = require('../middleware/auth.middleware');

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        // req.user.id comes from the 'protect' middleware after verifying the JWT
        const user = await pool.query(
            'SELECT id, username, email, department, student_year, created_at FROM users WHERE id = $1',
            [req.user.id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            status: "success",
            data: user.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   PUT /api/users/me
// @desc    Update profile (e.g., change department or year)
// @access  Private
router.put('/me', protect, async (req, res) => {
    const { department, student_year } = req.body;
    try {
        const updatedUser = await pool.query(
            'UPDATE users SET department = $1, student_year = $2 WHERE id = $3 RETURNING id, username, department, student_year',
            [department, student_year, req.user.id]
        );

        res.json({
            status: "success",
            message: "Profile updated successfully",
            data: updatedUser.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;