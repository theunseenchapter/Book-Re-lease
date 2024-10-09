const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "IAMCUTE";

exports.register = async (req, res) => {
  try {
    const {
      erpNo,
      password,
      name,
      gender,
      feesStatus,
      academicStatus,
      phoneNo,
      email,
      address,
      collegeYear,
      class: className,
      rollNo,
      aadharCardNo
    } = req.body;

    const existingStudent = await Student.findOne({ $or: [{ email }, { erpNo }] });
    if (existingStudent) {
      return res.status(400).json({ error: 'Student with given email or ERP number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      erpNo,
      password: hashedPassword,
      name,
      gender,
      feesStatus,
      academicStatus,
      phoneNo,
      email,
      address,
      collegeYear,
      class: className,
      rollNo,
      aadharCardNo
    });

    await student.save();
    res.status(201).json({ message: 'Student registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: student._id, role: 'student' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select('-password');
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const student = await Student.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.user._id);
    res.json({ message: 'Student account deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
