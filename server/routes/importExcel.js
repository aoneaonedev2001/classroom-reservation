const express = require('express');
const router = express.Router();

const {
    importAllStudent,
    importCourse
} = require('../controllers/importExcel');

// middleware 
const { authCheck,adminCheck } = require("../middleware/auth");

//import Excel All new students
//router.post('/importstudent',authCheck, adminCheck, importAllStudent);
router.post('/importstudent', importAllStudent);  
//import Excel Course
// router.post('/importcourse',authCheck,adminCheck, importCourse);
router.post('/importcourse',importCourse);

module.exports = router;