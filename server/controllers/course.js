const db = require("../db");

//----readAllCourse
exports.readAllCourse = async (req, res) => {
  const sql =
    "SELECT course.*, Subject.subj_name, Lecturer.lect_name FROM course LEFT JOIN Subject ON course.subj_code = Subject.subj_code LEFT JOIN Teach ON course.course_id = Teach.course_id LEFT JOIN Lecturer ON Teach.lect_id = Lecturer.lect_id";
  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.status(200).json(results);
  });
};

//----readCourse
exports.readCourse = async (req, res) => {
  const course_id = req.params.id;
  const sql = "SELECT * FROM course WHERE course_id=?";
  db.query(sql, course_id, (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.status(200).json(results);
  });
};

// --- readCoursesByLecturer
exports.readCoursesByLecturer = async (req, res) => {
  const { lect_id, years, term } = req.body;
  const sql = `
    SELECT c.course_id, c.subj_code, s.subj_name, c.room_id 
    FROM course c
    JOIN Teach t ON c.course_id = t.course_id
    JOIN Subject s ON c.subj_code = s.subj_code
    WHERE t.lect_id = ? AND c.Years = ? AND c.Term = ?
  `;
  db.query(sql, [lect_id, years, term], (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.status(200).json(results);
  });
};

exports.readCoursesByYearTerm = async (req, res) => {
  const { years, term } = req.body;
  const sql = `
  SELECT course.*, Subject.subj_name, Lecturer.lect_name 
  FROM course 
  LEFT JOIN Subject ON course.subj_code = Subject.subj_code 
  LEFT JOIN Teach ON course.course_id = Teach.course_id 
  LEFT JOIN Lecturer ON Teach.lect_id = Lecturer.lect_id
  WHERE  course.Years = ? AND course.Term = ?
  `;
  db.query(sql, [years, term], (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.status(200).json(results);
  });
};

//todo ยังไม่ได้ใช้ รอพัฒนาต่อ
// --- หาช่วงปีเทอม ที่อาจารคนนี้มีสอน
exports.readCoursesByLecturerAndDate = async (req, res) => {
  const { lect_id, date } = req.body;
  const sql = `
  SELECT c.course_id, c.subj_code, s.subj_name, c.room_id, cal.Years, cal.Term
  FROM course c
  JOIN Teach t ON c.course_id = t.course_id
  JOIN Subject s ON c.subj_code = s.subj_code
  JOIN (
      SELECT Years, Term
      FROM Calendar
      WHERE date_begin <= ? AND date_end >= ?
  ) cal ON c.Years = cal.Years AND c.Term = cal.Term
  WHERE t.lect_id = ?;
  `;
  db.query(sql, [date, date, lect_id], (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.status(200).json(results);
  });
};

//----deleteCourse
exports.deleteCourse = async (req, res) => {
  const course_id = req.params.id;

  // First, delete the course from the std_reg_course table
  db.query(
    "DELETE FROM std_reg_course WHERE course_id = ?",
    [course_id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
    }
  );

  // Then, delete the course from the teach table
  db.query(
    "DELETE FROM teach WHERE course_id = ?",
    [course_id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
    }
  );

  // Finally, delete the course from the course table
  db.query(
    "DELETE FROM course WHERE course_id = ?",
    [course_id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
    }
  );

  res
    .status(200)
    .json({
      message:
        "Courses for course_id " +
        course_id +
        " have been deleted successfully from std_reg_course, teach and course tables.",
    });
};

//----updateCourse
exports.updateCourse = async (req, res) => {
  const { id } = req.params; //id = course_id
  const { subj_code, room_id, Years, Term, day, time } = req.body;
  const sql =
    "UPDATE course SET subj_code = ?, room_id = ?, Years = ?, Term = ?, day = ?, time = ? WHERE course_id = ?";
  db.query(
    sql,
    [subj_code, room_id, Years, Term, day, time, id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
      res
        .status(200)
        .json({ message: "Course has been updated successfully." });
    }
  );
};
