const express = require('express');
const router = express.Router();

const {
  createLecturer,
  readAllLecturer,
  readLecturer,
  updateLecturer,
  deleteLecturer,
} = require("../controllers/lecturer");

router.post('/lecturer', createLecturer);
router.get('/lecturer', readAllLecturer);
router.get('/lecturer/:id', readLecturer);
router.put('/lecturer/:id', updateLecturer);
router.delete('/lecturer/:id', deleteLecturer);

module.exports = router;
