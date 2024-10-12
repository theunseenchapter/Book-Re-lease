const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const db = require('./db'); // Update with the correct path to your db.js file
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

// Start MongoDB connection
db.start(); // Call the start function to connect to the database

// Login Route
app.post('/login', async (req, res) => {
    const { erpId, password } = req.body;

    try {
        // Get the database instance
        const database = db.getDb();
        
        // Find user in MongoDB
        const user = await database.collection('BookRe-release').findOne({ erp_no: parseInt(erpId) });

        // Check if user exists
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid ERP ID or password' });
        }

        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.Password.toString()); // Ensure Password is a string

        if (isMatch) {
            // Generate JWT token upon successful login
            const token = jwt.sign({ userId: user.erp_no }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ success: true, token }); // Send the token to the client
        } else {
            return res.status(401).json({ success: false, message: 'Invalid ERP ID or password' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
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
app.get('/profile', authenticateJWT, async (req, res) => {
    const userId = req.user.userId; // userId from token

    try {
        // Get the database instance
        const database = db.getDb();
        
        const user = await database.collection('BookRe-release').findOne({ erp_no: userId }); // Use correct key
        if (user) {
            res.render('profile', { user }); // Render profile.ejs and pass user data
        } else {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        console.error('Error fetching user data:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Route to serve the homepage
app.get('/', (req, res) => {
    res.redirect('/login'); // Redirect to login page on homepage access
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
