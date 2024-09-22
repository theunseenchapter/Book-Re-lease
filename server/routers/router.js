const express = require("express");
const path = require("path"); // Require the path module
const router = express.Router();
const fs = require('fs');

// Serve login.html
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Serve index.html
router.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Serve browse.html
router.get('/browse', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/browse.html'));
});

// Serve profile.html
router.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/profile.html'));
});

// Login route for checking student ERP and password from student.json
router.post('/login', (req, res) => {
    const { erpId, password } = req.body;


    const filePath = '../data/student.json';


    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading student.json', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

    
        const students = JSON.parse(data);

        const student = students.find(stud => stud.erp_no === parseInt(erpId));

        if (student && student.Password === parseInt(password)) {
            res.json({ success: true, userId: student.erp_no });
        } else {
            res.json({ success: false, message: 'Invalid ERP ID or password' });
        }
    });
});

// Add student data route
router.post('/add-studenterp', (req, res) => {
    // Add your logic here for adding student ERP
    res.send("Add student ERP functionality not implemented yet.");
});

module.exports = router;
