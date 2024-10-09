const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentController');
const auth = require('../middleware/authMiddleware');
const clgStudentController = require('../controller/clgStudentController');

router.post('/login', studentController.login);

// Protected routes
router.get('/profile', auth, studentController.getProfile);
router.put('/profile', auth, studentController.updateProfile);
router.delete('/profile', auth, studentController.deleteAccount);


// clg student routes
router.post('/bulkUpload', clgStudentController.bulkUpload);


module.exports = router;
