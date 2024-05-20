const express = require('express');
const router = express.Router();

const {
    createStudent,
    readAllStudent,
    readStudent,
    updateStudent,
    deleteStudent,
} = require('../controllers/student');



router.post('/student', createStudent);
router.get('/student', readAllStudent);
router.get('/student/:id', readStudent);
router.put('/student/:id', updateStudent);
router.delete('/student/:id', deleteStudent);

module.exports = router;
