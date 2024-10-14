const express = require("express");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require('../db'); // Adjust with the correct path to your db.js

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    // Expecting token in "Authorization: Bearer <token>"
    const token = req.header('Authorization')?.split(' ')[1];
    console.log(token);  // Debugging: Check if the token is received

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden if token invalid
            }
            req.user = user; // Attach the user info (from token) to the request
            next();
        });
    } else {
        res.status(401).json({
            message: "Unauthorized - No token provided"
        });
    }
};

// Route to render login.ejs
router.get('/login', (req, res) => {
    res.render('login');
});

// Route to render profile.ejs (with authentication)
router.get('/profile', authenticateJWT, (req, res) => {
    // Pass the decoded user data (from the JWT) to the profile view
    res.render('profile', { user: req.user });
});

// Route to render index.ejs
router.get('/index', (req, res) => {
    res.render('index');
});

// Route to render browse.ejs
router.get('/browse', (req, res) => {
    res.render('browse');
});

router.post('/logout', (req, res) => {
    // Optionally, if you want to blacklist the token or remove the session, handle it here
  
    // Just send a response indicating the logout was successful
    return res.status(200).json({ message: 'Logout successful' });
  });

module.exports = router;
