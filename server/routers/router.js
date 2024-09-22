const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");



router.get("/something", (req, res) =>{
    res.send("hello world!")
})
// .render 




// add stuendent data routes : 

const studentController = require('../controller/studentController'); // Adjust the path if necessary

router.post('/add-studenterp', studentController.addMultipleStudents);


module.exports = router;