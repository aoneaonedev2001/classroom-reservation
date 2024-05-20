const db = require('../db');

//----Create std_reg_course
exports.createStdRegCourse = async (req, res) => {
    const { std_code, course_id } = req.body;
    const sql = "INSERT INTO std_reg_course (std_code, course_id) VALUES (?, ?)";
    db.query(sql, [std_code, course_id], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json({ message: "การลงทะเบียนคอร์สของนักศึกษาถูกสร้างสำเร็จแล้ว." });
    });
};

//----Read All std_reg_course
exports.readAllStdRegCourse = async (req, res) => {
    const sql = `
    SELECT src.std_code, src.course_id, s.subj_code,s.subj_name, st.std_name
    FROM std_reg_course src
    JOIN Course c ON src.course_id = c.course_id
    JOIN Subject s ON c.subj_code = s.subj_code
    JOIN Student st ON src.std_code = st.std_code 
    `;
    db.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json(results);
    });
};


// readAllStdRegCourseByCourseId
exports.readAllStdRegCourseByCourseId = async (req, res) => {
    const { id } = req.params; 
    const sql = `
    SELECT src.std_code, src.course_id, s.subj_code, s.subj_name, st.std_name
    FROM std_reg_course src
    JOIN Course c ON src.course_id = c.course_id
    JOIN Subject s ON c.subj_code = s.subj_code
    JOIN Student st ON src.std_code = st.std_code
    WHERE src.course_id = ? 
    `;
    db.query(sql, [id], (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
      res.status(200).json(results);
    });
  };






//----Delete std_reg_course
exports.deleteStdRegCourse = async (req, res) => {
    const { std_code, course_id } = req.params;
    const sql = "DELETE FROM std_reg_course WHERE std_code = ? AND course_id = ?";
    db.query(sql, [std_code, course_id], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json({ message: "การลงทะเบียนคอร์สของนักศึกษาถูกลบสำเร็จแล้ว." });
    });
};
