const db = require('../db');

//--Create Major
exports.createMajor = async (req, res) => {
    const { major_id, major_name } = req.body;
    const sql = "INSERT INTO Major (major_id, major_name) VALUES (?, ?)";
    db.query(sql, [major_id, major_name], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json({ message: "Major has been created successfully." });
    });
};

//---Read All Majors
exports.readAllMajors = async (req, res) => {
    const sql = 'SELECT * FROM Major';
    db.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json(results);
    });
};

//---Read Major
exports.readMajor = async (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM Major WHERE major_id = ?';
    db.query(sql, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json(results);
    });
};

//----Update Major
exports.updateMajor = async (req, res) => {
    const { major_id, major_name } = req.body;
    const sql = 'UPDATE Major SET major_name = ? WHERE major_id = ?';
    db.query(sql, [major_name, major_id], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json({ message: "Major has been updated successfully." });
    });
};

//----Delete Major
exports.deleteMajor = async (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Major WHERE major_id = ?';
    db.query(sql, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json({ message: "Major has been deleted successfully." });
    });
};
