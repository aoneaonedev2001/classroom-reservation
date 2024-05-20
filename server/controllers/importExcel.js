const db = require("../db");
const bcrypt = require("bcryptjs");

exports.importAllStudent = async (req, res) => {
  const { major_id, major_name, std_code, std_name } = req.body;

  const uniqueStdCodes = [...new Set(std_code)]; //กันข้อมูลซ้ำในbody

  const createMajorSql =
    "INSERT INTO major (major_id, major_name) VALUES (?, ?) ON DUPLICATE KEY UPDATE major_name = ?";
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
    "INSERT INTO student (std_code, major_id, std_name) VALUES (?, ?, ?)";
  const queries = [];

  // 2. Create Student
  // Loop through each unique student code and name, and insert into the database.
  for (let i = 0; i < uniqueStdCodes.length; i++) {
    const query = new Promise((resolve, reject) => {
      // First, check if the student code already exists in the database.
      db.query(
        "SELECT * FROM student WHERE std_code = ?",
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

  const queries = [];

  // 1. Insert subject
  const insertSubjectQuery = new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM subject WHERE subj_code = ?",
      [subj_code],
      (error, results) => {
        if (error) {
          reject(error);
        } else if (results.length > 0) {
          // If the subject code already exists, skip this insertion.
          resolve();
        } else {
          // If the subject code does not exist, proceed with the insertion.
          db.query(
            "INSERT INTO subject (subj_code, subj_name) VALUES (?, ?)",
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
      "SELECT * FROM course WHERE course_id = ?",
      [course_id],
      (error, results) => {
        if (error) {
          reject(error);
        } else if (results.length > 0) {
          // ถ้า course_id มีอยู่แล้ว ข้ามขั้นตอนการเพิ่มข้อมูล
          resolve();
        } else {
          // ถ้า course_id ยังไม่มี ดำเนินการเพิ่มข้อมูล

          // กำหนดว่าเวลาเป็น AM หรือ PM โดยดูจากเวลาเริ่มต้น (time_begin)
          const timeParts = time_begin.split(":");
          const hours = parseInt(timeParts[0], 10);
          const isAM = hours < 12;

          // เพิ่มข้อมูลลงในตาราง course
          db.query(
            "INSERT INTO course (course_id, subj_code, room_id, Years, Term, day, time) VALUES (?, ?, ?, ?, ?, ?, ?)",
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
      "SELECT * FROM lecturer WHERE lect_id = ?",
      [lect_id],
      (error, results) => {
        if (error) {
          reject(error);
        } else if (results.length > 0) {
          // If the lect_id already exists, skip this insertion.
          resolve();
        } else {
          // If the lect_id does not exist, proceed with the insertion.
          db.query(
            "INSERT INTO lecturer (lect_id, lect_name) VALUES (?, ?)",
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
  // Check if user_id (lect_id) already exists in Users
  const checkUserQuery = new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM Users WHERE user_id = ?",
      [lect_id],
      (error, results) => {
        if (error) {
          reject(error);
        } else if (results.length > 0) {
          // If the user_id already exists, skip this insertion.
          resolve();
        } else {
          // If the user_id does not exist, proceed with the insertion.
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
      "SELECT * FROM teach WHERE lect_id = ? AND course_id = ?",
      [lect_id, course_id],
      (error, results) => {
        if (error) {
          reject(error);
        } else if (results.length > 0) {
          // If the lect_id and course_id already exists, skip this insertion.
          resolve();
        } else {
          // If the lect_id and course_id does not exist, proceed with the insertion.
          db.query(
            "INSERT INTO teach (lect_id, course_id) VALUES (?, ?)",
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
      "SELECT * FROM major WHERE major_id = ?",
      [major_id],
      (error, results) => {
        if (error) {
          reject(error);
        } else if (results.length > 0) {
          // If the major_id already exists, skip this insertion.
          resolve();
        } else {
          // If the major_id does not exist, proceed with the insertion.
          db.query(
            "INSERT INTO major (major_id, major_name) VALUES (?, ?)",
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
        "SELECT * FROM student WHERE std_code = ?",
        [std_code[i]],
        (error, results) => {
          if (error) {
            reject(error);
          } else if (results.length > 0) {
            resolve(); // Skip if std_code exists
          } else {
            const createStudentSql =
              "INSERT INTO student (std_code, major_id, std_name) VALUES (?, ?, ?)";
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
        "SELECT * FROM std_reg_course WHERE std_code = ? AND course_id = ?",
        [std_code[i], course_id],
        (error, results) => {
          if (error) {
            reject(error);
          } else if (results.length > 0) {
            resolve();
          } else {
            const createStdRegCourseSql =
              "INSERT INTO std_reg_course (std_code, course_id) VALUES (?, ?)";
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
    .catch((error) => res.status(500).json({ error }));
};
