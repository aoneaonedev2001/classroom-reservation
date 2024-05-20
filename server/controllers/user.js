const db = require('../db');
const bcrypt = require("bcryptjs");



//---Read All Users
exports.readAllUser = async (req, res) => {
    const sql = 'SELECT * FROM Users';
    db.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json(results);
    });
};

//---Read User
exports.readUser = async (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM Users WHERE user_id = ?';
    db.query(sql, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json(results);
    });
};

//----Update User
exports.updateUser = async (req, res) => {
  const { user_id, password, user_name, role } = req.body;

  try {
      const saltRounds = 10; // จำนวนรอบในการเข้ารหัส
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const sql = 'UPDATE Users SET password = ?, user_name = ?, role = ? WHERE user_id = ?';
      db.query(sql, [hashedPassword, user_name, role, user_id], (error, results) => {
          if (error) {
              return res.status(500).json({ error });
          }
          res.status(200).json({ message: "User has been updated successfully." });
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
  }
};

//----Update Password
exports.updatePassword = async (req, res) => {
    const { user_id, oldPassword, newPassword, confirmPassword } = req.body;
  
    // ตรวจสอบรหัสผ่านเก่า
    const sql = 'SELECT password FROM Users WHERE user_id = ?';
    db.query(sql, [user_id], async (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
  
      const user = results[0];
  
      const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  
      if (!isOldPasswordCorrect) {
        return res.status(400).json('รหัสผ่านเก่าไม่ถูกต้อง');
      }
  
      // ตรวจสอบว่ารหัสผ่านใหม่และการยืนยันรหัสผ่านใหม่ตรงกันหรือไม่
      if (newPassword !== confirmPassword) {
        return res.status(400).json('รหัสผ่านใหม่ไม่ตรงกัน');
      }
  
      // ทำการเข้ารหัสรหัสผ่านใหม่
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
      // อัปเดตรหัสผ่านใหม่ในฐานข้อมูล
      const updateSql = 'UPDATE Users SET password = ? WHERE user_id = ?';
      db.query(updateSql, [hashedPassword, user_id], (updateError) => {
        if (updateError) {
          return res.status(500).json({ error: updateError });
        }
        res.status(200).json('รหัสผ่านได้รับการอัปเดตเรียบร้อยแล้ว');
      });
    });
  };
  


//----Delete User
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Users WHERE user_id = ?';
    db.query(sql, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json({ message: "User has been deleted successfully." });
    });
};
