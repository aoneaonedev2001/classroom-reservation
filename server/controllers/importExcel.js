const db = require("../db");
const bcrypt = require("bcryptjs");

exports.importAllStudent = async (req, res) => {
  const { major_id, major_name, std_code, std_name } = req.body;

  const uniqueStdCodes = [...new Set(std_code)]; //กันข้อมูลซ้ำในbody

  const createMajorSql =
    "INSERT INTO Major (major_id, major_name) VALUES (?, ?) ON DUPLICATE KEY UPDATE major_name = ?";
  db.query(
    createMajorSql,
    [major_id, major_name, major_name],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
    }
  );

  const createStudentSql =
    "INSERT INTO Student (std_code, major_id, std_name) VALUES (?, ?, ?)";
  const queries = [];

  // 2. Create Student
  // Loop through each unique student code and name, and insert into the database.
  for (let i = 0; i < uniqueStdCodes.length; i++) {
    const query = new Promise((resolve, reject) => {
      // First, check if the student code already exists in the database.
      db.query(
        "SELECT * FROM Student WHERE std_code = ?",
        [uniqueStdCodes[i]],
        (error, results) => {
          if (error) {
            reject(error);
          } else if (results.length > 0) {
            // If the student code already exists, skip this insertion.
            resolve();
          } else {
            // If the student code does not exist, proceed with the insertion.
            db.query(
              createStudentSql,
              [uniqueStdCodes[i], major_id, std_name[i]],
              (error, results) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          }
        }
      );
    });
    queries.push(query);
  }
  //Promise.all จะรอให้ทุกคำสั่ง SQL ทำงานเสร็จสิ้นก่อนที่จะส่ง response กลับไปยัง client.
  Promise.all(queries)
    .then(() =>
      res
        .status(200)
        .json({ message: "Major and Students have been created successfully." })
    )
    .catch((error) => res.status(500).json({ error }));
};




exports.importCourse = async (req, res) => {
  const {
    subj_code,
    subj_name,
    course_id,
    room_id,
    Years,
    Term,
    day,
    time_begin,
    time_end,
    lect_id,
    lect_name,
    std_code,
    major_id,
    major_name,
    std_name,
  } = req.body;
  //console.log("req.body", req.body);
  
  // เช็คว่ามีค่าในฟิลด์ที่จำเป็นหรือไม่
if (!subj_code || !course_id || !room_id || !lect_id || !std_code || !subj_name || !Years || !Term || !day || !time_begin || !time_end || !lect_name || !major_id || !major_name || !std_name) {
  return res.status(400).json({ message: "Required fields are missing" });
}
  const queries = [];

  // 1. Insert subject
  const insertSubjectQuery = new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM Subject WHERE subj_code = ?",
      [subj_code],
      (error, results) => {
        if (error) {
          reject(error);
        } else if (results.length > 0) {
          resolve();
        } else {
          db.query(
            "INSERT INTO Subject (subj_code, subj_name) VALUES (?, ?)",
            [subj_code, subj_name],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        }
      }
    );
  });
  queries.push(insertSubjectQuery);

  // 3. Insert course
  const insertCourseQuery = new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM Course WHERE course_id = ?",
      [course_id],
      (error, results) => {
        if (error) {
          reject(error);
        } else if (results.length > 0) {
          resolve();
        } else {
          const timeParts = time_begin.split(":");
          const hours = parseInt(timeParts[0], 10);
          const isAM = hours < 12;

          db.query(
            "INSERT INTO Course (course_id, subj_code, room_id, Years, Term, day, time) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
              course_id,
              subj_code,
              room_id,
              Years,
              Term,
              day,
              isAM ? "AM" : "PM",
            ],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        }
      }
    );
  });
  queries.push(insertCourseQuery);

  // 4. Insert lecturer
  const insertLecturerQuery = new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM Lecturer WHERE lect_id = ?",
      [lect_id],
      (error, results) => {
        if (error) {
          reject(error);
        } else if (results.length > 0) {
          resolve();
        } else {
          db.query(
            "INSERT INTO Lecturer (lect_id, lect_name) VALUES (?, ?)",
            [lect_id, lect_name],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        }
      }
    );
  });
  queries.push(insertLecturerQuery);

  // 5. Hash the password (lect_id) before inserting into Users
  const hashedPassword = await bcrypt.hash(lect_id, 10);
  const checkUserQuery = new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM Users WHERE user_id = ?",
      [lect_id],
      (error, results) => {
        if (error) {
          reject(error);
        } else if (results.length > 0) {
          resolve();
        } else {
          const insertUserQuery = new Promise((resolve, reject) => {
            db.query(
              "INSERT INTO Users (user_id, password, user_name, role) VALUES (?, ?, ?, ?)",
              [lect_id, hashedPassword, lect_name, "user"],
              (error, results) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          });
          resolve(insertUserQuery);
        }
      }
    );
  });
  queries.push(checkUserQuery);

  // 6. Insert into teach
  const insertTeachQuery = new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM Teach WHERE lect_id = ? AND course_id = ?",
      [lect_id, course_id],
      (error, results) => {
        if (error) {
          reject(error);
        } else if (results.length > 0) {
          resolve();
        } else {
          db.query(
            "INSERT INTO Teach (lect_id, course_id) VALUES (?, ?)",
            [lect_id, course_id],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        }
      }
    );
  });
  queries.push(insertTeachQuery);

  // 7. Insert into major
  const insertMajorQuery = new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM Major WHERE major_id = ?",
      [major_id],
      (error, results) => {
        if (error) {
          reject(error);
        } else if (results.length > 0) {
          resolve();
        } else {
          db.query(
            "INSERT INTO Major (major_id, major_name) VALUES (?, ?)",
            [major_id, major_name],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        }
      }
    );
  });
  queries.push(insertMajorQuery);

  // 8. Insert into student (new section)
  for (let i = 0; i < std_code.length; i++) {
    const query = new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM Student WHERE std_code = ?",
        [std_code[i]],
        (error, results) => {
          if (error) {
            reject(error);
          } else if (results.length > 0) {
            resolve();
          } else {
            const createStudentSql =
              "INSERT INTO Student (std_code, major_id, std_name) VALUES (?, ?, ?)";
            db.query(
              createStudentSql,
              [std_code[i], major_id, std_name[i]],
              (error, results) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          }
        }
      );
    });
    queries.push(query);
  }

  // 9. Insert into std_reg_course
  for (let i = 0; i < std_code.length; i++) {
    const query = new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM STD_REG_COURSE WHERE std_code = ? AND course_id = ?",
        [std_code[i], course_id],
        (error, results) => {
          if (error) {
            reject(error);
          } else if (results.length > 0) {
            resolve();
          } else {
            const createStdRegCourseSql =
              "INSERT INTO STD_REG_COURSE (std_code, course_id) VALUES (?, ?)";
            db.query(
              createStdRegCourseSql,
              [std_code[i], course_id],
              (error, results) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              }
            );
          }
        }
      );
    });
    queries.push(query);
  }

  // Wait for all queries to finish before sending a response.
  Promise.all(queries)
    .then(() =>
      res.status(200).json({
        message:
          "Courses, Subjects, Lecturers, and Registrations have been imported successfully.",
      })
    )
    .catch((error) => {
      console.error("Error occurred during import:", error);  // บันทึกข้อผิดพลาด
      res.status(500).json({ error });
    });
};

