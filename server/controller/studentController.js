const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "IAMCUTE";
const ClgStudent = require("../models/ClgStudent");

exports.login = async (req, res) => {
  try {
    console.log("hello world");
    const { Number_erp, password } = req.body;
    const student = await ClgStudent.findOne({erp_no: Number_erp });
    console.log("erp"+ Number_erp);
    console.log("password"+ password);
    if (!student) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = (password === student.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: student._id, role: "student" }, JWT_SECRET, {
      expiresIn: "30d",
    });
    const newuser=new Student(
      {
        name:student.name,
        email:student.email,
        password:student.password,
        role:"student",
        erp_no:student.erp_no,
        academic_status: student.academic_status,
        phone_no: student.phone_no,
        address: student.address,
        gender:  student.gender,
        college_year: student.college_year,
        class: student.class,
        rollNo: student.rollNo,
        aadhar_card_no: student.aadhar_card_no,
        fees_status: student.fees_status,
        
      }
    )
    const existingUser = await Student.findOne({erp_no: newuser.erp_no });
    if(existingUser){
    res.status(200).json({success:true,message:"Login Successful" ,user: student, token: token });
    }
    else{
      await newuser.save();
      res.status(200).json({success:true,message:"Login Successful" ,user: student, token: token });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error " + err });
  }
};
 
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select("-password");
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
