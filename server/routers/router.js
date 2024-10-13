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



module.exports = router;
