const express = require("express");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require('../db'); // Adjust with the correct path to your db.js

// Serve login.ejs
router.get('/login', (req, res) => {
    res.render('login');
});

// Serve index.ejs
router.get('/index', (req, res) => {
    res.render('index');
});

// Serve browse.ejs
router.get('/browse', (req, res) => {
    res.render('browse');
});

// Serve profile.ejs with user data from MongoDB
router.get('/profile', async (req, res) => {
    const userId = req.user.userId; // userId set in authenticateJWT
    const database = db.getDb(); // Get the database instance

    try {
        const user = await database.collection('BookRe-release').findOne({ erp_no: userId }); // Fetch user from MongoDB

        if (user) {
            res.render('profile', { user }); // Pass user data to profile.ejs
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        console.error('Error fetching user data from MongoDB', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login route for checking student ERP and password
router.post('/login', async (req, res) => {
    const { erpId, password } = req.body;
    const database = db.getDb(); // Get the database instance

    try {
        const student = await database.collection('BookRe-release').findOne({ erp_no: parseInt(erpId) }); // Fetch student from MongoDB

        // Check if student exists and password matches
        if (student && student.Password === parseInt(password)) { // Adjust password check according to your hashing method
            const token = jwt.sign({ userId: student.erp_no }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ success: true, token }); // Send the token to the client
        } else {
            res.json({ success: false, message: 'Invalid ERP ID or password' });
        }
    } catch (err) {
        console.error('Error during login', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
