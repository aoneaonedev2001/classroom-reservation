const db = require("../db");


//----  หาวันเวลาว่าง
exports.findAvailableTimeSlots = async (req, res) => {
  try {
    const { course_id, lect_id, start_date, end_date, roomtype_id, year,term } = req.body;
    //const { course_id="25662CPE5001", lect_id="745695", start_date="2024-05-06", end_date="2024-05-10", roomtype_id="1", year="2566",term="2" } = req.body;
//todo----------------------------------------------เรียกใช้ Stored Procedure----------------------------------------------------------
 
 //0: ประกาศตัวเเปลใหม่เพราะชื่อไปทับกับtable ใน database ตอน query
     const lect_id_db= lect_id;
     const course_id_db= course_id;
     const roomtype_id_db= roomtype_id;
     const year_db= year;
     const term_db= term;
 //1: เรียกใช้ Stored Procedure และส่งพารามิเตอร์ lect_id_db, course_id_db, start_date, end_date
    const [results, _fields] = await db
      .promise()
      .query("CALL getAllSchedule(?, ?, ?, ?, ?, ?, ?)", [
        lect_id_db,
        course_id_db,
        start_date,
        end_date,
        roomtype_id_db,
        year_db,
        term_db
      ]);
       
 //2: set data ข้อมูลที่ได้จาก database ลงตัวเเปร
    const teachRows = results[0];              // ข้อมูลตารางสอนปกติของอาจารย์
    const reservationRows = results[1];        // ข้อมูลการจองห้องของอาจารย์
    const stdScheduleRows = results[2];        // ข้อมูลตารางเรียนของนักเรียนในคอร์สทุกคน
    const reservationRowsStudent = results[3]; // ข้อมูลการจองห้องของนักเรียนในคอร์สทุกคน
    const roomTypeRows=results[4];             // ข้อมูลห้องที่ตรงกับชนิดห้องที่ต้องการ roomtype_id
    const normalScheduleRows = results[5];     // ข้อมูลตารางสอนปกติของห้องตาม roomtype_id
    const reservationRowsRoom = results[6];      // ข้อมูลการจองห้องของห้องเรียนที่ตรงกับ roomtype_id
    
//todo----------------------------------------------A.Lectuler----------------------------------------------------------

 //3: สร้าง Object lectScheduleObject โดยใช้วันที่เป็น key
    const lectScheduleObject = {};
    const currentDate = new Date(start_date);
    const endDate = new Date(end_date);
    while (currentDate <= endDate) {
      const formattedDate = currentDate.toISOString().split("T")[0];
      const dayName = getDayFromDate(formattedDate);
      lectScheduleObject[formattedDate] = {
        AM: 0,
        PM: 0,
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

 //4: นำข้อมูลตารางสอนมาใส่ใน Object ของอาจารย์
    for (const row of teachRows) {
      const { day, time } = row;
      if (time === "AM" || time === "PM") {
        for (const date in lectScheduleObject) {
          if (day === getDayFromDate(date)) {
            lectScheduleObject[date][time] = 1;
          }
        }
      }
    }

 //5: นำข้อมูลการสอนเพิ่มเติมมาใส่ใน Object ของอาจารย์
    for (const row of reservationRows) {
      const { reservation_date, reservation_time } = row;
      const formattedDate = new Date(reservation_date);
      formattedDate.setDate(formattedDate.getDate() + 1); // ปัดวันขึ้นไป 1 วัน
      const formattedDateISOString = formattedDate.toISOString().split("T")[0];
      if (lectScheduleObject[formattedDateISOString]) {
        lectScheduleObject[formattedDateISOString][reservation_time] = 1;
      }
    }

//todo----------------------------------------------B.Student----------------------------------------------------------
    
 //6: สร้าง Object stdScheduleObject โดยใช้วันที่เป็น key
    const stdScheduleObject = {};
    const currentDateStd = new Date(start_date);
    while (currentDateStd <= endDate) {
      const formattedDateStd = currentDateStd.toISOString().split("T")[0];
      const dayNameStd = getDayFromDate(formattedDateStd);
      stdScheduleObject[formattedDateStd] = {
        AM: 0,
        PM: 0,
      };
      currentDateStd.setDate(currentDateStd.getDate() + 1);
    }

 //7: นำข้อมูลวันว่างของนักเรียนมาใส่ใน Object ของนักเรียน
    for (const row of stdScheduleRows) {
      const { day, time } = row;
      if (time === "AM" || time === "PM") {
        for (const date in stdScheduleObject) {
          if (day === getDayFromDate(date)) {
            stdScheduleObject[date][time] = 1;
          }
        }
      }
    }

 //8: นำข้อมูลการจองมาเพิ่มใน Object ของนักเรียน
    for (const row of reservationRowsStudent) {
      const { reservation_date, reservation_time } = row;
      const formattedDate = new Date(reservation_date);
      formattedDate.setDate(formattedDate.getDate() + 1); // ปัดวันขึ้นไป 1 วัน
      const formattedDateISOString = formattedDate.toISOString().split("T")[0];
      if (stdScheduleObject[formattedDateISOString]) {
        stdScheduleObject[formattedDateISOString][reservation_time] = 1;
      }
    }

 //todo----------------------------------------------C.  คือนำ A.Lectuler + B.Student === C.resultA+B. ----------------------------------------------------------

 //9: รวม Object lectScheduleObject และ stdScheduleObject เข้าด้วยกัน
    const combinedSchedule = {};
    for (const date in lectScheduleObject) {
      combinedSchedule[date] = {
        AM: stdScheduleObject[date].AM || lectScheduleObject[date].AM,
        PM: stdScheduleObject[date].PM || lectScheduleObject[date].PM,
      };
    } 
//todo------------------------------------------------D.Room---------------------------------------------------------------------------
    
 //10: สร้าง Object เพื่อเก็บข้อมูลวันว่างของห้องตาม roomtype_id
   const roomSchedules = {};
   for (const row of roomTypeRows) {
     const { room_id } = row;
     roomSchedules[room_id] = {}; // สร้าง Object ว่างเพื่อเก็บข้อมูลของห้อง
     const currentDate = new Date(start_date);
     while (currentDate <= endDate) {
       const formattedDate = currentDate.toISOString().split("T")[0];
       roomSchedules[room_id][formattedDate] = {
         AM: 0,
         PM: 0,
       };
       currentDate.setDate(currentDate.getDate() + 1);
     }
   }
  
 //11: นำข้อมูลตารางสอนปกติมาใส่ใน Object ของห้อง
 for (const row of normalScheduleRows) {
  const { room_id, day, time } = row;
  if (time === "AM" || time === "PM") {
    for (const date in roomSchedules[room_id]) {
      if (day === getDayFromDate(date)) {
        roomSchedules[room_id][date][time] = 1;
      }
    }
  }
}

  // เพิ่มโค้ดนี้เพื่อดึง roomIds ออกมา ทำในข้อ13
  const roomIds = Object.keys(roomSchedules);

//12: นำข้อมูลการจองของห้องที่ตรงกับ roomtype_id มาใส่ใน Object
for (const row of reservationRowsRoom) {
  const { room_id, reservation_date, reservation_time } = row;
  const formattedDate = new Date(reservation_date);
  formattedDate.setDate(formattedDate.getDate() + 1); // ปัดวันขึ้นไป 1 วัน
  const formattedDateISOString = formattedDate.toISOString().split("T")[0];
  if (
    roomSchedules[room_id] &&
    roomSchedules[room_id][formattedDateISOString]
  ) {
    roomSchedules[room_id][formattedDateISOString][reservation_time] = 1;
  }
}

//todo------------------------------------------------E.  คือนำ D.Room +C.resultA+B ====E.ผลลัพ ---------------------------------------------------------------------------

// ข้อ 13: รวม Object combinedSchedule และ Object roomSchedules ของทุกห้อง
const combinedRoomSchedules = {};
for (const room_id of roomIds) {
  combinedRoomSchedules[room_id] = {};
  for (const date in combinedSchedule) {
    combinedRoomSchedules[room_id][date] = {
      AM: combinedSchedule[date].AM || roomSchedules[room_id][date].AM,
      PM: combinedSchedule[date].PM || roomSchedules[room_id][date].PM,
    };
  }
}



//todo------------------------------------------------F. เเปลงข้อมูลตัดข้อมูลที่ไม่ใช้ออกก่อนส่งไปหน้าบ้าน ---------------------------------------------------------------------------

//ข้อ 14    (1.ตัดวันที่ตรงกับเสาร์อาทิตย์ออก 2.เเปลงAm,Pm เป็นช่วงเช้าช่วงบ่าย)
const transformScheduleData = (scheduleData) => {
  const transformedData = {};

  for (const room_id in scheduleData) {
    transformedData[room_id] = {};

    for (const date in scheduleData[room_id]) {
      const timeData = scheduleData[room_id][date];

      // ตรวจสอบว่าวันที่ไม่ใช่วันเสาร์หรืออาทิตย์
      const jsDate = new Date(date);
      if (jsDate.getDay() !== 0 && jsDate.getDay() !== 6) {
        // ตรวจสอบว่าช่วงเช้าและช่วงบ่ายไม่ว่างทั้งคู่หรือไม่
        if (timeData["AM"] !== 1 || timeData["PM"] !== 1) {
          // ถ้าไม่ว่างทั้งคู่ให้เพิมข้อมูลลงใน transformedData
          transformedData[room_id][date] = {};

          // แปลง "AM": 0 เป็นช่วงเช้า
          if (timeData["AM"] === 0) {
            transformedData[room_id][date]["ช่วงเช้า"] = 0;
          }

          // แปลง "PM": 0 เป็นช่วงบ่าย
          if (timeData["PM"] === 0) {
            transformedData[room_id][date]["ช่วงบ่าย"] = 0;
          }
        }
      }
    }
  }

  return transformedData;
};
//เลียกใช้function ตัดข้อมูล
const transformedData = transformScheduleData(combinedRoomSchedules);


//ข้อ15   จัดเรียง array เพื่อให้หน้าบ้าน map loop ได้ง่ายขึ้น 
function transformDataToallResult(transformedData) {
  const allResult = [];
  for (const room_id in transformedData) {
    for (const date in transformedData[room_id]) {
      for (const time in transformedData[room_id][date]) {
        if (transformedData[room_id][date][time] === 0) {
          allResult.push({
            room_id: parseInt(room_id),
            date,
            time,
          });
        }
      }
    }
  }

  return allResult;
}
// เรียกใช้ฟังก์ชันเพื่อแปลงข้อมูล
const allResult = transformDataToallResult(transformedData);
//console.log(allResult);



    // ส่งข้อมูลผลลัพธ์กลับ 
    res.json({
      //lectScheduleObject: lectScheduleObject,       //A.Lectuler
      //stdScheduleObject: stdScheduleObject,         //B.Student
      //combinedSchedule: combinedSchedule,           //C.resultA+B
      //roomSchedules: roomSchedules,                 //D.Room
      //combinedRoomSchedules:combinedRoomSchedules,  //E.ผลลัพ
      //transformedData:transformedData               //F.ตัดข้อมูลผลลัพที่ไม่ได้ใช้
      allResult:allResult                           //ส่งผลลัพจัดเรียงไปหน้าบ้าน
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "An error occurred while fetching the available time slots.",
    });
  }
};

function getDayFromDate(date) {
  const dayNames = [
    "อาทิตย์",
    "จันทร์",
    "อังคาร",
    "พุธ",
    "พฤหัสบดี",
    "ศุกร์",
    "เสาร์",
  ];
  const jsDate = new Date(date);
  const dayIndex = jsDate.getDay(); // 0 = อาทิตย์, 1 = จันทร์, ...
  return dayNames[dayIndex];
}











//-----------  จองห้อง ----------------------- 
exports.createReservation = async (req, res) => {
  const { reservation_id, lect_id, course_id, room_id, status_code, Tran_dt, start_date, end_date, reservation_date, reservation_time } = req.body;

  // เพิ่มข้อมูลใน Reservation
  const reservationSql = "INSERT INTO Reservation (reservation_id, user_id, course_id, room_id, status_code, Tran_dt, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(reservationSql, [reservation_id, lect_id, course_id, room_id, status_code, Tran_dt, start_date, end_date], (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    // เพิ่มข้อมูลใน Reservation_detail
    const reservationDetailSql = "INSERT INTO Reservation_detail (reservation_id, reservation_date, reservation_time) VALUES (?, ?, ?)";
    db.query(reservationDetailSql, [reservation_id, reservation_date, reservation_time], (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
      res.status(200).json({ message: "Reservation has been created successfully." });
    });
  });
};





//--------------------  อ่านประวัติการจองจากวันที่ ---------------- 
exports.readReservationByDate = async (req, res) => {
  const { reservation_date_db } = req.body; // เปลี่ยนเป็นตัวแปรที่คุณใช้ในการรับวันที่จาก req.body
  const sql = `
    SELECT r.*, rd.reservation_date, rd.reservation_time
    FROM Reservation r
    JOIN Reservation_detail rd ON r.reservation_id = rd.reservation_id
    WHERE rd.reservation_date = ?
  `;
  db.query(sql, [reservation_date_db], (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.status(200).json( results);
  });
};

//--------------------หาวันที่ใช้ห้องในปีเทอมนั้นๆ
exports.fildUseRoominCuerrentTerm=async (req, res) => {
  const {room_id, Year, Term } = req.params; 
  const sql =`
  SELECT c.course_id, c.subj_code, c.day, c.time ,s.subj_name
  FROM  Course c
  JOIN  Subject s ON c.subj_code = s.subj_code
  WHERE c.room_id = ? AND c.Years = ? AND c.Term = ? 
`;
db.query(sql,[room_id, Year, Term],(error, results) =>{
  if (error) {
    return res.status(500).json({ error:error });
  }
  res.status(200).json(results); 
})

}

//--------------------  อ่านประวัติการจองจาก Year Term ---------------- 
  exports.readReservationByYearTerm = async (req, res) => {
    const { Year, Term } = req.params; 
  
    const sql = `
      SELECT r.*, rd.reservation_date, rd.reservation_time,c.subj_code,s.subj_name,u.user_name,ro.capacity
      FROM Reservation r
      JOIN Reservation_detail rd ON r.reservation_id = rd.reservation_id
      JOIN Course c ON r.course_id = c.course_id
      JOIN users u ON r.user_id = u.user_id
      JOIN Subject s ON c.subj_code = s.subj_code
      JOIN room ro ON c.room_id = ro.room_id
      WHERE c.Years = ? AND c.Term = ?
    `;
  
    db.query(sql, [Year, Term], (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
      res.status(200).json(results);
    });
  };
  



//---------------อ่านประวัติการจองทั้งหมด ---------------- 
exports.readAllReservation = async (req, res) => {
  const sql = `
  SELECT r.*, rd.reservation_date, rd.reservation_time, c.subj_code, s.subj_name,u.user_name,ro.capacity
  FROM Reservation r 
  JOIN Reservation_detail rd ON r.reservation_id = rd.reservation_id
  JOIN Course c ON r.course_id = c.course_id
  JOIN Subject s ON c.subj_code = s.subj_code
  JOIN users u ON r.user_id = u.user_id
  JOIN room ro ON c.room_id = ro.room_id
  `;
  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.status(200).json(results);
  });
};



//--------------------อ่านประวัติการจองจาก user_id ---------------- 
exports.readReservationById = async (req, res) => {
  const { id } = req.params; 
  const sql = `
      SELECT r.reservation_id,r.room_id, rd.reservation_date, rd.reservation_time, c.subj_code, s.subj_name
      FROM Reservation r
      JOIN Reservation_detail rd ON r.reservation_id = rd.reservation_id
      JOIN Course c ON r.course_id = c.course_id
      JOIN Subject s ON c.subj_code = s.subj_code
        WHERE r.user_id = ?
  `;
  db.query(sql, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.status(200).json(results);
  });
};



//--------------------อ่านประวัติการจองจาก room_id ---------------- 
exports.readReservationByRoomId = async (req, res) => {
  const { id } = req.params;  // เปลี่ยนชื่อตัวแปรเป็น room_id
  const sql = `
  SELECT r.reservation_id, r.user_id, r.room_id, rd.reservation_date, rd.reservation_time, u.user_name
  FROM Reservation r
  JOIN Reservation_detail rd ON r.reservation_id = rd.reservation_id
  JOIN Users u ON r.user_id = u.user_id
  WHERE r.room_id = ?;  
  `;
  db.query(sql, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.status(200).json(results);
  });
};




//---------------     ลบการจอง ---------------- 
exports.deleteReservation = async (req, res) => {
  const { id } = req.params;
    // ลบข้อมูลจากตาราง Reservation_detail 
    const deleteDetailSql = "DELETE FROM Reservation_detail WHERE reservation_id = ?";
    db.query(deleteDetailSql, [id], (error, detailResult) => {
      if (error) {
        return res.status(500).json({ error });
      }
      res.status(200).json({ message: "Reservation has been deleted successfully." });
      // ลบข้อมูลจากตาราง Reservation 
     const deleteReservationSql = "DELETE FROM Reservation WHERE reservation_id = ?";
     db.query(deleteReservationSql, [id], (error, reservationResult) => {
       if (error) {
       return res.status(500).json({ error });
      }
    }); 
  });
};




