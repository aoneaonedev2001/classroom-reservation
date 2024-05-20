const express = require('express');
const router = express.Router();
const { register, login,currentUser } = require('../controllers/auth');

// middleware 
const { authCheck,adminCheck } = require("../middleware/auth");


router.post('/register', register);
router.post('/login', login);

router.post("/current-user", authCheck, currentUser);             // use middleware (auth)
router.post("/current-admin", authCheck,adminCheck, currentUser); // use middleware (auth, adminCheck)

module.exports = router;
