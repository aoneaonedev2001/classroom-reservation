const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;

//middleware
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "20mb" }));
app.use(cors());

// Route
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/user"));
app.use("/api", require("./routes/room")); //test good
app.use("/api", require("./routes/major")); //test good
app.use("/api", require("./routes/lecturer")); //test good
app.use("/api", require("./routes/subject")); //test good
app.use("/api", require("./routes/student")); //test good
app.use("/api", require("./routes/std_reg_course")); //test good
app.use("/api", require("./routes/calendar")); //test good
app.use("/api", require("./routes/course")); //test good
app.use("/api", require("./routes/importExcel")); //test good
app.use("/api", require("./routes/reservation")); //test good

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
