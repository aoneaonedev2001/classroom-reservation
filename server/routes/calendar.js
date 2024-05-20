//วันเริ่มต้น สิ้นสุดปี ปีเทอม
const express = require('express');
const router = express.Router();

const {
    createCalendar,
    readAllCalendars,
    readCalendar,
    readCalendarBydate,
    updateCalendar,
    deleteCalendar
} = require("../controllers/calendar");

router.post("/calendar", createCalendar);
router.get("/calendar", readAllCalendars);
router.get("/calendar/:Years/:Term", readCalendar);
router.get("/calendar/:id", readCalendarBydate);
router.put("/calendar", updateCalendar);
router.delete("/calendar/:Years/:Term", deleteCalendar);

module.exports = router;
