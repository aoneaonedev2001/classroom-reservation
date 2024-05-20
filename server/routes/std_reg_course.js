const express = require('express');
const router = express.Router();

// controller
const {
    createStdRegCourse,
    readAllStdRegCourse,
    readAllStdRegCourseByCourseId,
    deleteStdRegCourse
} = require('../controllers/std_reg_course');

router.post("/std_reg_course", createStdRegCourse);  //todo
router.get("/std_reg_course", readAllStdRegCourse);  //todo อ่านนักเรียนทั้งหมด
router.get("/std_reg_course/:id", readAllStdRegCourseByCourseId);  //todo อ่านนักเรียนทั้งหมดจาก course_id
router.delete("/std_reg_course/:std_code/:course_id", deleteStdRegCourse); //todo

module.exports = router;
