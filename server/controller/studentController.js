const Student = require('../models/Student.js'); 

const addMultipleStudents = async (req, res) => {
  try {
    const students = req.body;

    console.log("thsi data: " + JSON.stringify(students))

    if (!Array.isArray(students)) {
      return res.status(400).json({ message: 'Invalid input. Expected an array of students.' });
    }

    const result = await Student.insertMany(students);
    // const result = await Student.insertOne(students);


    res.status(201).json({ message: 'Students added successfully.', data: result });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while adding students.', error: error.message });
  }
};

module.exports = {
  addMultipleStudents
};
