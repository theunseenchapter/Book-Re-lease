const JWT_SECRET = "IAMCUTE";

const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; 
  if (!token) {
    return res.status(401).json({ error: 'Authentication token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); 
    if (decoded.role === 'student') {
      const student = await Student.findById(decoded.id);
      if (!student) {
        throw new Error();
      }
      req.user = student;
      req.role = 'student';
    } else if (decoded.role === 'admin') {
      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        throw new Error();
      }
      req.user = admin;
      req.role = 'admin';
    }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid authentication token' });
  }
};

module.exports = auth;
 