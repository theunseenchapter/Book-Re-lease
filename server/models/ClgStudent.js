const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const clgStudentSchema = new mongoose.Schema({
  erp_no: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  fees_status: { type: String, required: true },
  academic_status: { type: String, required: true },
  phone_no: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  college_year: { type: String, required: true },
  class: { type: String, required: true },
  rollNo: { type: Number, required: true },
  aadhar_card_no: { type: String, required: true },
});

clgStudentSchema.pre('save', async function (next) {
    const student = this;
    if (!student.isModified('password')) return next();
  
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(student.password, salt);
    next();
  });

const ClgStudent = mongoose.model("ClgStudent", clgStudentSchema);
module.exports = ClgStudent;
