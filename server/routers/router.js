const express = require("express");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require('../db'); // Adjust with the correct path to your db.js

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Expecting token in "Authorization: Bearer <token>"

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden if token invalid
            }
            req.user = user; // Attach the user info (from token) to the request
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized if no token provided
    }
};

// Route to render login.ejs
router.get('/login', (req, res) => {
    res.render('login');
});

// Route to render index.ejs
router.get('/index', (req, res) => {
    res.render('index');
});

// Route to render browse.ejs
router.get('/browse', (req, res) => {
    res.render('browse');
});

// Route to render profile.ejs with user data from MongoDB, protected by JWT middleware
router.get('/profile', authenticateJWT, async (req, res) => {
    const userId = req.user.userId; // userId set in authenticateJWT
    const database = db.getDb(); // Get the MongoDB database instance

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

// Login route to authenticate user ERP and password
router.post('/login', async (req, res) => {
    const { erpId, password } = req.body;
    const database = db.getDb(); // Get the MongoDB database instance

    try {
        // Fetch student by ERP number from MongoDB
        const student = await database.collection('BookRe-release').findOne({ erp_no: parseInt(erpId) });

        // Check if student exists and if the password matches (ensure correct password storage/checking)
        if (student && student.Password === parseInt(password)) { // Adjust password check if hashed
            // Generate JWT token
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
