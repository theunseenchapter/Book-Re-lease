const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  erpNo: {
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
  feesStatus: { 
    type: String,
    enum: ['paid', 'half', 'pending'],
    required: true
  },
  academicStatus: { 
    type: String,
    enum: ['Eligible', 'Not Eligible'],
    required: true
  },
  phoneNo: { 
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
  collegeYear: { 
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
  aadharCardNo: { 
    type: String,
    required: true
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
