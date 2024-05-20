const express = require('express');
const router = express.Router();

const {
  createMajor,
  readAllMajors,
  readMajor,
  updateMajor,
  deleteMajor,
} = require('../controllers/major');

router.post('/major', createMajor);
router.get('/major', readAllMajors);
router.get('/major/:id', readMajor);
router.put('/major/update', updateMajor);
router.delete('/major/:id', deleteMajor);

module.exports = router;
