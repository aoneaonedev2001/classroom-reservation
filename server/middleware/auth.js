const jwt = require("jsonwebtoken");
const db = require('../db');

// authCheck  (decodes the token)
exports.authCheck = (req, res, next) => { 
  try {
    const token = req.headers["authtoken"]; // get the token sent from the header
    //console.log(token);
    if (!token) { // if don't have token
      return res.status(401).send("No token, authorization denied");
    }               
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token
    req.user = decoded.user; // set the user property in request
    
    next(); // go to the next middleware
  } catch (err) {
    console.log(err);
    res.status(401).send("Token Invalid!!");
  }
};



// adminCheck  (checks the user role)
exports.adminCheck = (req, res, next) => {
  try {
    const { userId } = req.user; // get the username from the user object in request

    // Prepare the SQL statement
    const sql = "SELECT * FROM users WHERE user_id = ?";

    // Execute the SQL statement
    db.query(sql, [userId], (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error });
      }

      // Get the first (and should be only) user from the results
      const user = results[0];

      // Check if the user has the role 'admin'
      if (user.role !== 'admin') {
        return res.status(403).send("Admin Access denied");
      } 

      next(); // go to the next middleware
    });
  } catch (err) {
    console.log(err);
    res.status(401).send("Admin Access denied");
  }
};