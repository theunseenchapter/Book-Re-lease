const express = require("express");
const mongoose = require("mongoose");
const studentRoutes = require("./routers/studentRoutes");
const adminRoutes = require("./routers/adminRoutes");
const bookRoutes = require("./routers/booksRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const dbName = "bookstore";

mongoose
  .connect(
    `mongodb+srv://oscar:I6TUsF3dLRLBkZ8P@oscar.rvxt1.mongodb.net/bookstore?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log(`MongoDB connected to ${dbName} database`))
  .catch((err) => console.error("MongoDB connection error:", err));


app.get("/", (req, res) => {
  res.send(`OSCAR is very Cute`);
});

app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/books", bookRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Click here to access the app: http://localhost:${PORT}/`);
});
