const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  condition: { 
    type: String,
    enum: ['New', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  },
  status: { 
    type: String,
    enum: ['Available', 'Sold', 'Lent'],
    default: 'Available'
  },
  listedBy: { 
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  borrower: { 
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
