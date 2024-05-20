const db = require('../db');

//----createSubject
exports.createSubject = async (req, res) => {
    const { subj_code, subj_name } = req.body;
    const sql = 'INSERT INTO subject (subj_code, subj_name) VALUES (?, ?)';
    db.query(sql, [subj_code, subj_name], (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
      res.status(201).json({ message: 'Subject created successfully.' });
    });
  };
  

  //----readAllSubjects
  exports.readAllSubjects = async (req, res) => {
    const sql = 'SELECT * FROM subject';
    db.query(sql, (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
      res.status(200).json(results);
    });
  };
  

  //----readSubject
  exports.readSubject = async (req, res) => {
    const subj_code = req.params.id;
    const sql = 'SELECT * FROM subject WHERE subj_code = ?';
    db.query(sql, [subj_code], (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Subject not found.' });
      }
      res.status(200).json(results[0]);
    });
  };
  

  //----updateSubject
  exports.updateSubject = async (req, res) => {
    const { subj_name } = req.body;
    const subj_code = req.params.id;
    const sql = 'UPDATE subject SET subj_name = ? WHERE subj_code = ?';
    db.query(sql, [subj_name, subj_code], (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Subject not found.' });
      }
      res.status(200).json({ message: 'Subject updated successfully.' });
    });
  };
  
  
  //----deleteSubject
  exports.deleteSubject = async (req, res) => {
    const subj_code = req.params.id;
    const sql = 'DELETE FROM subject WHERE subj_code = ?';
    db.query(sql, [subj_code], (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Subject not found.' });
      }
      res.status(200).json({ message: 'Subject deleted successfully.' });
    });
  };
  