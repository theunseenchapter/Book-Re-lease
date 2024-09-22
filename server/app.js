const express = require("express");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const router = require("./routers/router");
const fileUpload = require("express-fileupload");
const path = require("path");

const cors = require("cors");
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
app.set("views", "views");
app.set("view engine", "ejs");

// Redirect root URL to login.html
app.get('/', (req, res) => {
    res.redirect('/login'); // Redirect to the login route
});

// Use the router
app.use("/", router);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
