const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the student data
const studentSchema = new Schema({
  erp_no: {
    type: Number,
    required: true,
    unique: true
  },
  Password: {
    type: Number,
    required: true
  },
  Name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  fees_status: {
    type: String,
    enum: ['paid', 'half', 'pending'],
    required: true
  },
  academic_status: {
    type: String,
    enum: ['Eligible', 'Not Eligible'],
    required: true
  },
  phone_no: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  college_year: {
    type: String,
    enum: ['FE', 'SE', 'TE', 'BE'],
    required: true
  },
  class: {
    type: String,
    required: true
  },
  rollNo: {
    type: Number,
    required: true
  },
  aadhar_card_no: {
    type: String,
    required: true
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
