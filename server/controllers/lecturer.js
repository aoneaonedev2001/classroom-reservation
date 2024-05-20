const db = require('../db');

exports.createLecturer = async (req, res) => {
    const { lect_id, lect_name } = req.body;
    const sql = "INSERT INTO lecturer (lect_id, lect_name) VALUES (?, ?)";
    db.query(sql, [lect_id, lect_name], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json({ message: "Lecturer has been created successfully." });
    });
};


exports.readAllLecturer = async (req, res) => {
    const sql = "SELECT * FROM lecturer";
    db.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json(results);
    });
};


exports.readLecturer = async (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM lecturer WHERE lect_id = ?";
    db.query(sql, id, (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No lecturer found with this ID." });
        }
        res.status(200).json(results[0]);
    });
};

exports.updateLecturer = async (req, res) => {
    const { id } = req.params;
    const { lect_name } = req.body;
    const sql = "UPDATE lecturer SET lect_name = ? WHERE lect_id = ?";
    db.query(sql, [lect_name, id], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json({ message: "Lecturer has been updated successfully." });
    });
};

exports.deleteLecturer = async (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM lecturer WHERE lect_id = ?";
    db.query(sql, id, (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json({ message: "Lecturer has been deleted successfully." });
    });
};

