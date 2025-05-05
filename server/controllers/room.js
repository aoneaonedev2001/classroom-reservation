const db = require('../db');

  
//----createRoom
exports.createRoom = async (req, res) => {
  const { room_id, roomtype_id, capacity, building } = req.body;
  const checkSql="SELECT * FROM Room WHERE room_id = ?"
  
  db.query(checkSql, [room_id], (error, results) => {
    if (error) {
        return res.status(500).json({ error: "An error occurred while creating room type." });
    }
    if (results.length > 0) {
        return res.status(400).json({ error: "ห้องนี้มีอยู่ในระบบเเล้ว" });
    }
    const sql = "INSERT INTO Room (room_id, roomtype_id, capacity, building) VALUES (?, ?, ?, ?)";
    db.query(sql, [room_id, roomtype_id, capacity, building], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json({ message: "Room has been created successfully." });
    });

   });
};


//---Read All Rooms with Room Type
exports.readAllRoom = async (req, res) => {
    const sql = "SELECT Room.*, RoomType.roomtype_name FROM Room JOIN RoomType ON Room.roomtype_id = RoomType.roomtype_id";
    db.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json(results);
    });
};



//----readRoom
exports.readRoom = async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM Room WHERE room_id = ?";
  db.query(sql, id, (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      if (results.length === 0) {
          return res.status(404).json({ message: "No room found with this ID." });
      }
      res.status(200).json(results[0]);
  });
};


//----readAllRoomBYType_id
exports.readAllRoomByRoomType_id = async (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM Room WHERE roomtype_id = ?";
    db.query(sql, id, (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No room type found with this ID." });
        }
        res.status(200).json(results); 
    });
};



//----deleteRoom
exports.deleteRoom = async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM Room WHERE room_id = ?";
  db.query(sql, id, (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      res.status(200).json({ message: "Room has been deleted successfully." });
  });
};


//----updateRoom
exports.updateRoom = async (req, res) => {
  const { id } = req.params;
  const { roomtype_id, capacity, building } = req.body;
  const sql = "UPDATE Room SET roomtype_id = ?, capacity = ?, building = ? WHERE room_id = ?";
  db.query(sql, [roomtype_id, capacity, building, id], (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      res.status(200).json({ message: "Room has been updated successfully." });
  });
};

//---------------------room type--------------------


//----createRoomType
exports.createRoomType = (req, res) => {
    const { roomtype_name } = req.body;
    try {
        const checkSql = "SELECT * FROM RoomType WHERE roomtype_name = ?";
        db.query(checkSql, [roomtype_name], (error, results) => {
            if (error) {
                return res.status(500).json({ error: "An error occurred while creating room type." });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: "มีชื่อชนิดห้องนี้อยู่ในระบบเเล้ว โปรดใช้ชื่อชนิดห้องอื่น" });
            }
            const insertSql = "INSERT INTO RoomType (roomtype_name) VALUES (?)";
            db.query(insertSql, [roomtype_name], (error, results) => {
                if (error) {
                    return res.status(500).json({ error: "An error occurred while creating room type." });
                }
                res.status(201).json({ message: "Room type has been created successfully." });
            });
        });
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while creating room type." });
    }
}; 



//----readAllRoomType
exports.readAllRoomType = async (req, res) => {
  const sql = "SELECT * FROM RoomType";
  db.query(sql, (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      res.status(200).json(results);
  });
};

//----readRoomType
exports.readRoomType = async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM RoomType WHERE roomtype_id = ?";
  db.query(sql, id, (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      if (results.length === 0) {
          return res.status(404).json({ message: "No room type found with this ID." });
      }
      res.status(200).json(results[0]);
  });
};

//----updateRoomType
exports.updateRoomType = async (req, res) => {
    const { id } = req.params;
    const { roomtype_name } = req.body;
  try {
    const checkSql = "SELECT * FROM RoomType WHERE roomtype_name = ?";
    
    db.query(checkSql, [roomtype_name], (error, results) => {
        if (error) {
            return res.status(500).json({ error: "An error occurred while creating room type." });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: "มีชื่อชนิดห้องนี้อยู่ในระบบเเล้ว โปรดใช้ชื่อชนิดห้องอื่น" });
        }
        const updateSql = "UPDATE RoomType SET roomtype_name = ? WHERE roomtype_id = ?";
        db.query(updateSql, [roomtype_name, id], (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }
            res.status(200).json({ message: "Room type has been updated successfully." });
        });
    });



    
    
  } catch (error) {
    
  }

  
 
 

};

//----deleteRoomType
exports.deleteRoomType = async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM RoomType WHERE roomtype_id = ?";
  db.query(sql, id, (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      res.status(200).json({ message: "Room type has been deleted successfully." });
  });
};





 