const express = require("express");
const mongoose = require("mongoose");
const studentRoutes = require("./routers/studentRoutes");
const adminRoutes = require("./routers/adminRoutes");
const viewRoutes = require("./routers/router");
const bookRoutes = require("./routers/booksRoutes");
const logoutRoutes = require("./routers/logoutRoutes"); // Import logoutRoutes
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Set the view engine to ejs
app.set("view engine", "ejs");

// Set the directory for static files
 app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const dbName = "bookstore";
const dbURI = `mongodb+srv://oscar:I6TUsF3dLRLBkZ8P@oscar.rvxt1.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`MongoDB connected to ${dbName} database`))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define API routes
app.use("/api/students", studentRoutes);
app.use("/api/logout", logoutRoutes); // Use logoutRoutes for logout functionality
app.use("/api/admin", adminRoutes);
app.use("/api/books", bookRoutes);
app.use("/", viewRoutes);

app.get("/", (req, res) => {
  res.redirect("/login"); // Redirect to login page
});

// 404 error handling
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Click here to access the app: http://localhost:${PORT}/`);
});
