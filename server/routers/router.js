const express = require("express");
const router = express.Router();


router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/book-details/:id", (req, res) => {
    const bookId = req.params.id; // Get the book ID from the URL
    res.render("confirmBook", { bookId }); // Pass the bookId to the EJS template
  });

// Route to render profile.ejs (with authentication)
router.get("/profile", (req, res) => {
  // Pass the decoded user data (from the JWT) to the profile view
  res.render("profile", { user: req.user });
});

// Route to render index.ejs
router.get("/index", (req, res) => {
  res.render("index");
});

// Route to render browse.ejs
router.get("/browse", (req, res) => {
  res.render("browse");
});

module.exports = router;
