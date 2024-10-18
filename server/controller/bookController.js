const Book = require("../models/Books");
const Transaction = require("../models/Transaction");
const Student = require("../models/Student");
const cloudinary = require("../Cloudinary");
const fs = require("fs");

// exports.createBook = async (req, res) => {
//   console.log("user id: " + req.userId)

//   try {
//     console.log("creating books........")
//     const { title, author, description, price, condition, status } = req.body;
//     console.log(req.body);
//   //   if (!req.files || Object.keys(req.files).length === 0) {
//   //     return res.status(400).json({ message: 'No files were uploaded.' });
//   // }

//   // Get the image from the request
//   // const imageFile = req.files.photo; // 'photo' is the name attribute of the input field

//   // // Upload the image to Cloudinary
//   // const book_image = await cloudinary.uploader.upload(imageFile.tempFilePath, {
//   //     public_id: 'uploaded_image_' + Date.now(), // Optional: generate a unique public ID
//   //     folder: 'uploads', // Optional: save in specific folder on Cloudinary
//   // });
//     const book = new Book({
//       title,
//       author,
//       description,
//       price: parseInt(price),
//       condition,
//       status,
//       listedBy: req.userId
//     });
//     await book.save();
//     res.status(201).json({ message: 'Book listed successfully', book });
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ error: 'Server error here', err: err });
//   }
// };
exports.createBook = async (req, res) => {
  console.log("hitting me? ");
  try {

    const { bookTitle, bookAuthor, bookType, bookPrice } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file was uploaded.' });
    }

    const imageFile = req.file;

    console.log("File Path: ", imageFile.path);

    const book_image = await cloudinary.uploader.upload(imageFile.path, {
      public_id: 'uploaded_image_' + Date.now(), 
      folder: 'uploads', 
    });

    console.log("Cloudinary Response: ", book_image);

    const book = new Book({
      title: bookTitle,
      author: bookAuthor,
      tradeType: bookType,
      price: bookPrice,
      book_image: book_image.url, 
      listedBy: req.userId
    });

    await book.save();
    res.status(201).json({ message: 'Book listed successfully', book });
  } catch (err) {
    console.error("Error Occurred: ", err);
    res.status(500).json({ error: 'Server error', details: err });
  }
};


exports.getAllBooks = async (req, res) => {
  console.log("hitting me?");
  try {
    const books = await Book.find({ status: "Available" }).populate(
      "listedBy",
      "name email class phone_no"
    );
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getBookById = async (req, res) => {
  try {
    console.log("working");
    console.log("book id: " + req.params.bookId)
    const { bookId } = req.params;
    const book = await Book.findById(bookId).populate(
      "listedBy",
      "name email phone_no class"
    );
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
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
      return res
        .status(404)
        .json({ error: "Book not found or not authorized" });
    }

    res.json({ message: "Book updated", book });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findOneAndDelete({
      _id: bookId,
      listedBy: req.user._id,
    });

    if (!book) {
      return res
        .status(404)
        .json({ error: "Book not found or not authorized" });
    }

    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// exports.buyBook = async (req, res) => {
//   try {
//     const { bookId } = req.params;
//     console.log("there ? ");

//     const book = await Book.findById(bookId);
//     if (!book || book.status !== "Available") {
//       console.log("book is already sold");
//       return res.status(200).json({ msg: "Book is not available for buying" });
//     }

//     book.status = "Sold";
//     await book.save();

//     // const transaction = new Transaction({
//     //   book: book._id,
//     //   buyer: req.user._id,
//     //   transactionType: 'buy',
//     //   status: 'completed'
//     // });
//     // await transaction.save();

//     res.json({ message: "Book bought successfully", transaction });
//   } catch (err) {
//     console.log("error: " + err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

exports.buyBook = async (req, res) => {
  console.log("no coming? ")

  try {
    console.log("coming? ")
    const { bookId } = req.params;
    const book = await Book.findById(bookId);

    if (!book || book.status !== "Available") {
      return res.status(400).json({ msg: "Book is not available for buying" });
    }

    if (book.listedBy.toString() === req.userId.toString()) {
      return res.status(403).json({ msg: "You cannot buy your own book" });
    }
    book.borrower = req.userId;
    book.status = "Sold";
    await book.save();

    res.json({ message: "Book bought successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.lendBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { borrowerId } = req.body;

    const book = await Book.findById(bookId);
    if (!book || book.status !== "Available") {
      return res
        .status(400)
        .json({ error: "Book is not available for lending" });
    }

    book.status = "Lent";
    book.borrower = borrowerId;
    await book.save();

    const transaction = new Transaction({
      book: book._id,
      lender: req.user._id,
      borrower: borrowerId,
      transactionType: "lend",
      status: "pending",
    });
    await transaction.save();

    res.json({ message: "Book lent successfully", transaction });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUserPurchasedBooks = async (req, res) => {
  console.log("hheere ")
  try {
    const userId = req.userId;
    // Find books where the user is the buyer
    const purchasedBooks = await Book.find({ borrower: userId });

    if (!purchasedBooks) {
      return res.status(404).json({ msg: "No books found for this user" });
    }

    res.json(purchasedBooks); // Return an array of books
  } catch (error) {
    console.log("here is the problem: ")
    console.error("Server error why:", error);
    res.status(500).json({ msg: "Server error why" });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book || book.status !== "Lent") {
      return res.status(400).json({ error: "Book is not currently lent" });
    }

    book.status = "Available";
    book.borrower = null;
    await book.save();

    const transaction = await Transaction.findOne({
      book: book._id,
      borrower: req.user._id,
      transactionType: "lend",
      status: "pending",
    });

    if (transaction) {
      transaction.status = "returned";
      await transaction.save();
    }

    res.json({ message: "Book returned successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
