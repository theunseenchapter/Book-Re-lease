const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentController');
const auth = require('../middleware/authMiddleware');

router.post('/register', studentController.register);
router.post('/login', studentController.login);

// Protected routes
router.get('/profile', auth, studentController.getProfile);
router.put('/profile', auth, studentController.updateProfile);
router.delete('/profile', auth, studentController.deleteAccount);

module.exports = router;
