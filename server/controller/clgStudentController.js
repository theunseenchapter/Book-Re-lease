const ClgStudent = require('../models/ClgStudent');


exports.bulkUpload = async (req, res) => {
    try {
      const students = req.body;
  
      if (!Array.isArray(students)) {
        return res.status(400).json({ error: 'Expected an array of students' });
      }
  
      const processedStudents = students.map(student => {
        if (typeof student.dob === 'object' && student.dob['$date']) {
          student.dob = new Date(student.dob['$date']);
        }
        return student;
      });
  
      const savedStudents = await ClgStudent.insertMany(processedStudents);
      res.status(201).json({ message: 'Students data uploaded successfully', savedStudents });
    } catch (err) {
      console.error('Error uploading students data:', err);
      res.status(500).json({ error: 'Error uploading students data' });
    }
  };