const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  buyer: { 
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  lender: { 
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  borrower: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  transactionType: { 
    type: String,
    enum: ['buy', 'lend'],
    required: true
  },
  transactionDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'returned'],
    default: 'pending'
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
