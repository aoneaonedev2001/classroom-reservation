const db = require("../db");

//--Create Calendar
exports.createCalendar = async (req, res) => {
  const { Years, Term, date_begin, date_end } = req.body;
  try {
    const checkSql = "SELECT * FROM Calendar WHERE Years = ? AND Term = ?";
    db.query(checkSql, [Years, Term], (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
      if (results.length > 0) {
        return res.status(400).json({ error: "ปีและเทอมนี้มีอยู่แล้วในระบบ" });
      }
      const sql =
        "INSERT INTO calendar (Years, Term, date_begin, date_end) VALUES (?, ?, ?, ?)";
      db.query(sql, [Years, Term, date_begin, date_end], (error, results) => {
        if (error) {
          return res.status(500).json({ error });
        }
        res
          .status(200)
          .json({ message: "Calendar has been created successfully." });
      });
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

//---Read All Calendars
exports.readAllCalendars = async (req, res) => {
  const sql = "SELECT * FROM calendar";
  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.status(200).json(results);
  });
};

//---readCalendar
exports.readCalendar = async (req, res) => {
  const { Years, Term } = req.params;
  const sql = "SELECT * FROM Calendar WHERE Years = ? AND Term = ?";
  db.query(sql, [Years, Term], (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.status(200).json(results);
  });
};

//---หาช่วงเวลาของ ปีเทอมนั้นๆ
exports.readCalendarBydate = async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM Calendar WHERE date_begin <= ? AND date_end >= ?";
  db.query(sql, [id, id], (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.status(200).json(results);
  });
};

//----updateCalendar
exports.updateCalendar = async (req, res) => {
  const { Years, Term, date_begin, date_end } = req.body;
  const sql =
    "UPDATE Calendar SET date_begin = ?, date_end = ? WHERE Years = ? AND Term = ?";
  db.query(sql, [date_begin, date_end, Years, Term], (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res
      .status(200)
      .json({ message: "Calendar has been updated successfully." });
  });
};

//----deleteCalendar
exports.deleteCalendar = async (req, res) => {
  const { Years, Term } = req.params;
  const sql = "DELETE FROM Calendar WHERE Years = ? AND Term = ?";
  db.query(sql, [Years, Term], (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res
      .status(200)
      .json({ message: "Calendar has been deleted successfully." });
  });
};
