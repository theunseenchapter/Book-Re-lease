const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS setup
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.static(path.join(__dirname, 'public')));

// Set views and template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Load student data
let studentData;
try {
    studentData = JSON.parse(fs.readFileSync('data/student.json', 'utf8')); // Ensure the correct path
} catch (error) {
    console.error('Error reading student.json:', error);
    process.exit(1);
}

// Login Route
app.post('/login', (req, res) => {
    const { erpId, password } = req.body;

    // Find user in the student.json data
    const user = studentData.find(student => student.erp_no === parseInt(erpId)); // Match with correct key

    // Check if user exists
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid ERP ID or password' });
    }

    // Compare the entered password with the stored hashed password
    bcrypt.compare(password, user.Password.toString(), (err, result) => { // Ensure Password is a string
        if (err) {
            console.error('Error during password comparison:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (result) {
            // Generate JWT token upon successful login
            const token = jwt.sign({ userId: user.erp_no }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ success: true, token }); // Send the token to the client
        } else {
            return res.status(401).json({ success: false, message: 'Invalid ERP ID or password' });
        }
    });
});

// Middleware to authenticate using JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            req.user = user; // Attach user to request
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};

// Route to serve the login page
app.get('/login', (req, res) => {
    res.render('login'); // Renders login.ejs
});

// Route to serve the index page after successful login
app.get('/index', authenticateJWT, (req, res) => {
    res.render('index'); // Renders index.ejs
});

// Profile Route
app.get('/profile', authenticateJWT, (req, res) => {
    const userId = req.user.userId; // userId from token
    const user = studentData.find(student => student.erp_no === userId); // Use correct key
    if (user) {
        res.render('profile', { user }); // Render profile.ejs and pass user data
    } else {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
