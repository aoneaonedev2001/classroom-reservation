const express = require("express");
const router = express.Router();

//controller
const {
  createRoom,
  readAllRoom,
  readRoom,
  updateRoom,
  deleteRoom,
  createRoomType,
  readAllRoomType,
  readRoomType,
  readAllRoomByRoomType_id,
  updateRoomType,
  deleteRoomType,
  } = require("../controllers/room");
  
  // middleware 
  const { authCheck,adminCheck } = require("../middleware/auth");
  
 //room
  //router.post("/room", authCheck,adminCheck,createRoom)
  router.post("/room",createRoom)
  router.get("/room", readAllRoom)
  router.get("/room/:id", readRoom)
  router.get("/roombyroomtype/:id", readAllRoomByRoomType_id)
  router.put("/room/:id",authCheck,adminCheck, updateRoom)
  router.delete("/room/:id",authCheck,adminCheck, deleteRoom)
  
  //room type
  router.post("/roomtype", createRoomType)
  router.get("/roomtype", readAllRoomType)
  router.get("/roomtype/:id", readRoomType)
  router.put("/roomtype/:id", updateRoomType)
  router.delete("/roomtype/:id", deleteRoomType)

  module.exports = router;