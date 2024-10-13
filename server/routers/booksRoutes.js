const express = require('express');
const router = express.Router();
const bookController = require('../controller/bookController');
const auth = require('../middleware/authMiddleware');

router.get('/get-allbooks', bookController.getAllBooks);
router.get('/:bookId', bookController.getBookById);

router.post('/create-book', auth, (req, res, next) => {
  if (req.role !== 'student') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
}, bookController.createBook);

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
router.post('/:bookId/buy', auth, (req, res, next) => {
  if (req.role !== 'student') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
}, bookController.buyBook);

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
