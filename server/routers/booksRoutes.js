const express = require('express');
const router = express.Router();
const bookController = require('../controller/bookController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
// const cloudinary = require('../Cloudinary')

// Configure multer to handle file uploads
const upload = multer({ dest: 'uploads/' }); // Choose the directory for saving uploaded files

// POST route for handling book creation
router.post('/create-book', auth, upload.single('photo'), bookController.createBook);
router.get('/get-allbooks', bookController.getAllBooks);
router.get('/:bookId', bookController.getBookById);

// router.post('/create-book',auth, bookController.createBook);

router.put('/:bookId', auth, (req, res, next) => {
  if (req.role !== 'student') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
}, bookController.updateBook);

router.delete('/:bookId', auth, (req, res, next) => {
  if (req.role !== 'student') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
}, bookController.deleteBook);




// Buying and Lending
router.post('/buy/:bookId', bookController.buyBook);

router.post('/:bookId/lend', auth, (req, res, next) => {
  if (req.role !== 'student') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
}, bookController.lendBook);

router.post('/:bookId/return', auth, (req, res, next) => {
  if (req.role !== 'student') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
}, bookController.returnBook);

module.exports = router;
