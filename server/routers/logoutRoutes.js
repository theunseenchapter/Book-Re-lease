// logoutRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
console.log(token);

    if (token) {
        jwt.verify(token, 'IAMCUTE', (err, user) => { // Replace with your secret
            if (err) {
                return res.sendStatus(403); // Forbidden if token invalid
            }
            req.user = user; // Attach the user info to the request
            next();
        });
    } else {
        res.status(401).json({ message: "Unauthorized - No token provided" });
    }
};

// // POST route to handle logout
router.post('/', (req, res) => {
    // Logic to handle logout (if any)
    return res.status(200).json({success:true, message: 'Logout successful' });
});

module.exports = router;
