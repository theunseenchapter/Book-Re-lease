const express = require("express");
const path = require("path");
const router = require("./routers/router");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require('dotenv').config(); // Load environment variables

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// Serve static files
app.use(express.static("public"));

// Set views and template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware to authenticate using JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization'];

  if (token) {
    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.sendStatus(403); // Forbidden
      }
      req.user = user; // Attach user to request
      next();
    });
  } else {
    console.error('No token provided');
    res.sendStatus(401); // Unauthorized
  }
};


// Use the router
app.use("/", router);

// Protect the profile route with JWT middleware
app.get('/profile', authenticateJWT, (req, res) => {
  res.render('profile', { user: req.user });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
