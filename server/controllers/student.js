const db = require('../db');

exports.createStudent = async (req, res) => {
    const { std_code, major_id, std_name } = req.body;
    const sql = "INSERT INTO student (std_code, major_id, std_name) VALUES (?, ?, ?)";
    db.query(sql, [std_code, major_id, std_name], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json({ message: "Student has been created successfully." });
    });
};

exports.readAllStudent = async (req, res) => {
    const sql = "SELECT s.std_code, s.major_id, s.std_name, m.major_name FROM student s LEFT JOIN major m ON s.major_id = m.major_id";
    db.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json(results);
    });
};




exports.readStudent = async (req, res) => {
    const { id } = req.params;
    const sql = "SELECT std_code, major_id, std_name FROM student WHERE std_code = ?";
    db.query(sql, id, (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No student found with this ID." });
        }
        res.status(200).json(results[0]);
    });
};

exports.updateStudent = async (req, res) => {
    const { id } = req.params;
    const { major_id, std_name } = req.body;
    const sql = "UPDATE student SET major_id = ?, std_name = ? WHERE std_code = ?";
    db.query(sql, [major_id, std_name, id], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json({ message: "Student has been updated successfully." });
    });
};

exports.deleteStudent = async (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM student WHERE std_code = ?";
    db.query(sql, id, (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json({ message: "Student has been deleted successfully." });
    });
};
