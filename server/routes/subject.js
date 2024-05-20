const express = require('express');
const router = express.Router();

const {
  createSubject,
  readAllSubjects,
  readSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/subject');

router.post('/subject', createSubject);
router.get('/subject', readAllSubjects);
router.get('/subject/:id', readSubject);
router.put('/subject/:id', updateSubject);
router.delete('/subject/:id', deleteSubject);

module.exports = router;
