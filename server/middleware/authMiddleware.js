const JWT_SECRET = "IAMCUTE";

const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Admin = require("../models/Admin");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader;
  console.log("token: " + token);
  if (!token) {
    return res.status(401).json({ error: "Authentication token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role === "student") {
      console.log("it's a student");
      // const student = await Student.findById(decoded.id);
      const decoded = jwt.verify(token, JWT_SECRET);
      // if (!student) {
      //   throw new Error();
      // }
      // req.user = student;
      // req.role = "student";
      req.userId = decoded.id;
    } else if (decoded.role === "admin") {
    //   const admin = await Admin.findById(decoded.id);
    const decoded = jwt.verify(token, JWT_SECRET);
    //   if (!admin) {
    //     throw new Error();
    //   }
    //   req.user = admin;
    //   req.role = "admin";
    req.adminId = decoded.id;
    }
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid authentication token" });
  }
};

module.exports = auth;
