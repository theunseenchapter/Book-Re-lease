const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "IAMCUTE";
const ClgStudent = require("../models/ClgStudent");

exports.login = async (req, res) => {
  try {
    console.log("hello world");
    const { Number_erp, password } = req.body;
    
    const clgStudent = await ClgStudent.findOne({ erp_no: Number_erp });
    
    if (!clgStudent) {
      return res.status(400).json({ error: "Invalid ERP Number or Student not found" });
    }

    console.log("ERP: " + Number_erp);
    console.log("Password: " + password);
    console.log("Student found in ClgStudent: " + clgStudent);

    const isMatch = (password === clgStudent.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: clgStudent._id, role: "student" }, JWT_SECRET, {
      expiresIn: "30d",
    });

    const existingStudent = await Student.findOne({ erp_no: clgStudent.erp_no });

    if (existingStudent) {
      console.log("Student already exists in the Student model, logging in...");
      return res.status(200).json({ success: true, message: "Login Successful", user: existingStudent, token });
    }

    const existingEmail = await Student.findOne({ email: clgStudent.email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already registered with another student" });
    }

    console.log("Creating a new student in the Student model...");
    const newStudent = new Student({
      name: clgStudent.name,
      email: clgStudent.email,
      password: clgStudent.password,
      role: "student",
      erp_no: clgStudent.erp_no ? clgStudent.erp_no : null,
      academic_status: clgStudent.academic_status,
      phone_no: clgStudent.phone_no,
      address: clgStudent.address,
      gender: clgStudent.gender,
      college_year: clgStudent.college_year,
      class: clgStudent.class,
      rollNo: clgStudent.rollNo,
      aadhar_card_no: clgStudent.aadhar_card_no,
      fees_status: clgStudent.fees_status,
    });

    await newStudent.save();
    
    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: newStudent,
      token,
    });

  } catch (err) {
    console.error("Error during login process: ", err);
    return res.status(500).json({ error: "Server error " + err });
  }
};

exports.getProfile = async (req, res) => {
  console.log("hitting me ?? here in get profile?  ")
  try {
    console.log("userId " + req.userId)
    const student = await ClgStudent.findById(req.userId).select("-password");
    console.log("the studen in get profile: " + student)
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const student = await Student.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.user._id);
    res.json({ message: "Student account deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
