const express = require("express");
const router = express.Router();

//controller
const {
  readAllCourse,
  readCourse,
  readCoursesByLecturer,
  readCoursesByLecturerAndDate,
  updateCourse,
  deleteCourse,
  readCoursesByYearTerm,
} = require("../controllers/course");

// create course ทำงานใน importExcel.js
router.get("/course", readAllCourse);
router.get("/course/:id", readCourse);
router.post("/course/readCoursesByLecturer", readCoursesByLecturer); //ดึงข้อมูลคอร์สที่ lecturer สอนในปีและภาคเรียนที่ระบุ
router.post("/course/readCoursesByYearTerm", readCoursesByYearTerm); //ดึงข้อมูลคอร์สที่ จากปีเทอม
router.post(
  "/course/readCoursesByLecturerAndDate",
  readCoursesByLecturerAndDate
); //ดึงข้อมูลคอร์สที่ lecturer สอนจากช่วงเวลา
router.put("/course/:id", updateCourse);
router.delete("/course/:id", deleteCourse);
module.exports = router;
