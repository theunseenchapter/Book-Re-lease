const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require('fs');
const jwt = require("jsonwebtoken");

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

// Serve profile.ejs with user data from student.json
router.get('/profile', (req, res) => {
    console.log("req : " + JSON.stringify(req.body));
    // Note: Authentication should already be handled in the app.js
    const userId = req.user.userId; // userId set in authenticateJWT
    // const filePath = path.join(__dirname, '../data/student.json'); // Adjusted file path

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading student.json', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        const students = JSON.parse(data);
        const user = students.find(stud => stud.erp_no === userId);

        if (user) {
            res.render('profile', { user }); // Pass user data to profile.ejs
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    });
});

// Login route for checking student ERP and password
router.post('/login', (req, res) => {
    console.log("hello ???")
    const { erpId, password } = req.body;
    const filePath = path.join(__dirname, '../data/student.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading student.json', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        const students = JSON.parse(data);
        const student = students.find(stud => stud.erp_no === parseInt(erpId));

        // Check if student exists and password matches
        if (student && student.Password === parseInt(password)) {
            console.log("here the error!")
            const token = jwt.sign({ userId: student.erp_no }, process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log("Token : " + token)
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid ERP ID or password' });
        }
    });
});

module.exports = router;
