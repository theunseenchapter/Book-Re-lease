const Book = require('../models/Books');
const Transaction = require('../models/Transaction');

exports.createBook = async (req, res) => {
  try {
    const { title, author, description, price, condition, status } = req.body;
    const book = new Book({
      title,
      author,
      description,
      price,
      condition,
      status,
      listedBy: req.user._id
    });
    await book.save();
    res.status(201).json({ message: 'Book listed successfully', book });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllBooks = async (req, res) => {
  console.log("hitting me?")
  try {
    const books = await Book.find({ status: 'Available' }).populate('listedBy', 'name email');
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId).populate('listedBy', 'name email');
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const updates = { ...req.body };

    const book = await Book.findOneAndUpdate(
      { _id: bookId, listedBy: req.user._id },
      updates,
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ error: 'Book not found or not authorized' });
    }

    res.json({ message: 'Book updated', book });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findOneAndDelete({ _id: bookId, listedBy: req.user._id });

    if (!book) {
      return res.status(404).json({ error: 'Book not found or not authorized' });
    }

    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.buyBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book || book.status !== 'Available') {
      return res.status(400).json({ error: 'Book is not available for buying' });
    }

    book.status = 'Sold';
    await book.save();

    const transaction = new Transaction({
      book: book._id,
      buyer: req.user._id,
      transactionType: 'buy',
      status: 'completed'
    });
    await transaction.save();

    res.json({ message: 'Book bought successfully', transaction });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.lendBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { borrowerId } = req.body; 

    const book = await Book.findById(bookId);
    if (!book || book.status !== 'Available') {
      return res.status(400).json({ error: 'Book is not available for lending' });
    }

    book.status = 'Lent';
    book.borrower = borrowerId;
    await book.save();

    const transaction = new Transaction({
      book: book._id,
      lender: req.user._id,
      borrower: borrowerId,
      transactionType: 'lend',
      status: 'pending'
    });
    await transaction.save();

    res.json({ message: 'Book lent successfully', transaction });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book || book.status !== 'Lent') {
      return res.status(400).json({ error: 'Book is not currently lent' });
    }

    book.status = 'Available';
    book.borrower = null;
    await book.save();

    const transaction = await Transaction.findOne({
      book: book._id,
      borrower: req.user._id,
      transactionType: 'lend',
      status: 'pending'
    });

    if (transaction) {
      transaction.status = 'returned';
      await transaction.save();
    }

    res.json({ message: 'Book returned successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};