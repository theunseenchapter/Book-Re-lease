const express = require("express");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require('../db'); // Adjust with the correct path to your db.js

require('dotenv').config(); 
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

<<<<<<< HEAD
// Serve profile.ejs with user data from MongoDB
router.get('/profile', async (req, res) => {
    const userId = req.user.userId; // userId set in authenticateJWT
    const database = db.getDb(); // Get the database instance
=======
// Serve profile.ejs with user data from student.json
router.get('/profile', (req, res) => {
    console.log("req : " + JSON.stringify(req.body));
    // Note: Authentication should already be handled in the app.js
    const userId = req.user.userId; // userId set in authenticateJWT
    // const filePath = path.join(__dirname, '../data/student.json'); // Adjusted file path
>>>>>>> 6cf02abec9c8912c187879a44889e0957746e8a2

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
<<<<<<< HEAD
router.post('/login', async (req, res) => {
=======
router.post('/login', (req, res) => {
    console.log("hello ???")
>>>>>>> 6cf02abec9c8912c187879a44889e0957746e8a2
    const { erpId, password } = req.body;
    const database = db.getDb(); // Get the database instance

    try {
        const student = await database.collection('BookRe-release').findOne({ erp_no: parseInt(erpId) }); // Fetch student from MongoDB

        // Check if student exists and password matches
<<<<<<< HEAD
        if (student && student.Password === parseInt(password)) { // Adjust password check according to your hashing method
=======
        if (student && student.Password === parseInt(password)) {
            console.log("here the error!")
>>>>>>> 6cf02abec9c8912c187879a44889e0957746e8a2
            const token = jwt.sign({ userId: student.erp_no }, process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log("Token : " + token)
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid ERP ID or password' });
        }
    } catch (err) {
        console.error('Error during login', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
