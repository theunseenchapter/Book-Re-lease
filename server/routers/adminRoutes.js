const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const auth = require('../middleware/authMiddleware');

router.post('/register', adminController.register); 
router.post('/login', adminController.login);

router.get('/students', auth, (req, res, next) => {
  if (req.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
}, adminController.getAllStudents);

router.delete('/students/:studentId', auth, (req, res, next) => {
  if (req.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
}, adminController.deleteStudent);

// Similarly, add routes to manage books if needed

module.exports = router;
