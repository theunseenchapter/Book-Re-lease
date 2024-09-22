const express = require("express");
const path = require("path"); // Require the path module
const router = express.Router();
const userController = require("../controller/userController");
const studentController = require('../controller/studentController'); // Adjust the path if necessary

router.get("/something", (req, res) =>{
    res.send("hello world!")
})
// Route to serve login.html
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Route to serve index.html
router.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Route to serve browse.html
router.get('/browse', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/browse.html'));
});

// Route to serve profile.html
router.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/profile.html'));
});

// Add student data route
router.post('/add-studenterp', studentController.addMultipleStudents);

module.exports = router;
