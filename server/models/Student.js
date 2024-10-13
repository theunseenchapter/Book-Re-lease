const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  erp_no: {
    type: Number,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: { 
    type: String,
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
    required: false
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
