const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'Vivek',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// CORS setup
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.static(path.join(__dirname, 'public')));

let studentData;
try {
    studentData = JSON.parse(fs.readFileSync('student.json', 'utf8'));
} catch (error) {
    console.error('Error reading student.json:', error);
    process.exit(1);
}

// Login Route
app.post('/login', (req, res) => {
    const { erpId, password } = req.body;

    // Find user in the student.json data
    const user = studentData.find(student => student.erpId === erpId);

    // Check if user exists
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid ERP ID or password' });
    }

    // Compare the entered password with the stored hashed password
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
            console.error('Error during password comparison:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (result) {
            // Set session data upon successful login
            req.session.userId = user.erpId;
            return res.status(200).json({ success: true, message: 'Login successful', userId: user.erpId });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid ERP ID or password' });
        }
    });
});

// Route to serve index.html after successful login
app.get('/index.html', (req, res) => {
   // if (req.session.userId) {
       res.sendFile(path.join(__dirname, 'public', 'index.html'));
    //} else {
      //  res.status(401).send('Unauthorized');
    //}
});
app.get('/',(req,res)=>{
    res.send("hello world")
})
// Profile Route (Optional if required)
app.get('/profile', (req, res) => {
    if (req.session.userId) {
        // Find user data based on session userId
        const user = studentData.find(student => student.erpId === req.session.userId);
        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    } else {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
