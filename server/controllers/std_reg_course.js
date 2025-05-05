const db = require('../db');

//----Create STD_REG_COURSE
exports.createStdRegCourse = async (req, res) => {
    const { std_code, course_id } = req.body;
    const sql = "INSERT INTO STD_REG_COURSE (std_code, course_id) VALUES (?, ?)";
    db.query(sql, [std_code, course_id], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json({ message: "การลงทะเบียนคอร์สของนักศึกษาถูกสร้างสำเร็จแล้ว." });
    });
};

//----Read All STD_REG_COURSE
exports.readAllStdRegCourse = async (req, res) => {
    const sql = `
    SELECT src.std_code, src.course_id, s.subj_code,s.subj_name, st.std_name
    FROM STD_REG_COURSE src
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
    FROM STD_REG_COURSE src
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






//----Delete STD_REG_COURSE
exports.deleteStdRegCourse = async (req, res) => {
    const { std_code, course_id } = req.params;
    const sql = "DELETE FROM STD_REG_COURSE WHERE std_code = ? AND course_id = ?";
    db.query(sql, [std_code, course_id], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json({ message: "การลงทะเบียนคอร์สของนักศึกษาถูกลบสำเร็จแล้ว." });
    });
};
