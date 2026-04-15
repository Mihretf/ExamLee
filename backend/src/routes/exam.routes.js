const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect } = require('../middleware/auth.middleware');
const {isAdmin} = require("../middleware/admin.middleware");

// @route   GET /api/exams/feed
// @desc    Get exams tailored to user's department and year
// @access  Private
router.get('/feed', protect, async (req, res) => {
    try {
        // 1. Get user preferences from the token (via middleware)
        const { department, student_year } = req.user;

        // 2. Query exams that match the user's "Home" profile
        const query = `
            SELECT * FROM exams 
            WHERE department = $1 AND student_year = $2
            ORDER BY created_at DESC
        `;
        
        const exams = await pool.query(query, [department, student_year]);

        res.json({
            status: "success",
            results: exams.rows.length,
            data: exams.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error fetching feed" });
    }
});

// @route   GET /api/exams/search
// @desc    Search for any exam across the university
// @access  Private
router.get('/search', protect, async (req, res) => {
    try {
        const { q, department, type, year, instructor } = req.query;
        
        // Basic dynamic search logic
        let queryText = 'SELECT * FROM exams WHERE 1=1';
        let queryParams = [];

        if (q) {
            queryParams.push(`%${q}%`);
            queryText += ` AND (course_name ILIKE $${queryParams.length} OR course_code ILIKE $${queryParams.length})`;
        }

        if (department) {
            queryParams.push(department);
            queryText += ` AND department = $${queryParams.length}`;
        }

        if (year) {
            queryParams.push(parseInt(year));
            queryText += ` AND student_year = $${queryParams.length}`;
        }

        if (type) {
            queryParams.push(type);
            queryText += ` AND exam_type = $${queryParams.length}`;
        }

        if (instructor) {
            queryParams.push(`%${instructor}%`);
            queryText += ` AND instructor ILIKE $${queryParams.length}`;
        }

        queryText+= ' ORDER BY created_at DESC ';

        console.log("Executing Query:", queryText);
        console.log("With Params:", queryParams);
        
        const results = await pool.query(queryText, queryParams);

        if (results.rows.length === 0) {
            return res.status(200).json({
                status: "success",
                message: "No exams matched your search criteria.",
                count: 0,
                data: []
            });
        }

        const rowCount = (results && results.rows) ? results.rows.length : 0;
        const data = (results && results.rows) ? results.rows : [];

        res.json({
            status: "success",
            count: rowCount,
            data: data
        });
    } catch (err) {
        console.error("Search Error:", err.message);
        res.status(500).json({ error: "Search failed" });
    }
});
router.post('/upload', protect, isAdmin, async (req, res) => {
    try {
        const { 
            course_name, 
            course_code, 
            instructor, 
            exam_type, 
            academic_year, 
            department, 
            student_year, 
            file_url 
        } = req.body;

        // Validation: Ensure all fields are present
        if (!course_name || !course_code || !department || !file_url) {
            return res.status(400).json({ error: "Missing required exam details" });
        }

        const query = `
            INSERT INTO exams 
            (course_name, course_code, instructor, exam_type, academic_year, department, student_year, file_url, uploader_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *
        `;

        const values = [
            course_name, 
            course_code, 
            instructor, 
            exam_type, 
            academic_year, 
            department, 
            student_year, 
            file_url,
            req.user.id // Captured from the 'protect' middleware
        ];

        const newExam = await pool.query(query, values);

        res.status(201).json({
            status: "success",
            message: "Exam uploaded successfully",
            data: newExam.rows[0]
        });

    } catch (err) {
        console.error("Upload Error:", err.message);
        res.status(500).json({ error: "Server error during exam upload" });
    }
});


module.exports = router;