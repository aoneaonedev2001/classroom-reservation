# Classroom Reservation System (CMS)
ระบบจองห้องเรียนออนไลน์นี้ถูกสร้างโดยใช้โครงสร้าง MVC (Model-View-Controller) และมีอัลกอริทึมการค้นหาวันเวลาที่เหมาะสำหรับอาจารย์และนักศึกษาในคอร์สเพื่อหาห้องว่างตามที่ผู้ใช้หรืออาจารย์กำหนด เพื่อให้ผู้ใช้สามารถทำการจองห้องเรียนเพิ่มเติมได้ ระบบถูกแบ่งออกเป็น 2 บทบาทหลัก คือบทบาทของ "อาจารย์" หรือ "User" และ "ผู้ดูแลระบบ" หรือ "Admin" เพื่อรองรับการจัดการระบบ

1. บทบาทของผู้ใช้ทั่วไป (Users/อาจารย์) 
สามารถค้นหาวันเวลาที่เหมาะสำหรับคอร์ส ระบบช่วยในการค้นหาห้องว่างตามที่ผู้ใช้หรืออาจารย์กำหนด และทำให้ผู้ใช้สามารถทำการจองห้องเรียนออนไลน์ได้.

2. บทบาทของผู้ดูแลระบบ (Admin) บทบาทนี้เป็นผู้ดูแลระบบที่มีสิทธิ์สูงสุดในการจัดการระบบ ซึ่งรวมถึงการบริหารจัดการระบบ, การจัดการข้อมูลผู้ใช้, และการตรวจสอบความถูกต้องของการจองห้องเรียนที่ผู้ใช้ทำ.

- [function ภาพรวมระบบ](#function-%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%A3%E0%B8%A7%E0%B8%A1%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A)
- [เทคโนโลยีเเละเครื่องมือที่ใช้ในการพัฒนา](#%E0%B9%80%E0%B8%97%E0%B8%84%E0%B9%82%E0%B8%99%E0%B9%82%E0%B8%A5%E0%B8%A2%E0%B8%B5%E0%B9%80%E0%B9%80%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B9%83%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%9E%E0%B8%B1%E0%B8%92%E0%B8%99%E0%B8%B2)
- [การติดตั้งระบบ](#%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%95%E0%B8%B4%E0%B8%94%E0%B8%95%E0%B8%B1%E0%B9%89%E0%B8%87%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A)
- [ขั้นตอนการทำงานระบบ](#%E0%B8%82%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%95%E0%B8%AD%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%97%E0%B8%B3%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A)
- [รูปภาพตัวอย่างระบบ](#%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%95%E0%B8%B1%E0%B8%A7%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A)

## function ภาพรวมระบบ
### User 
- เเสดงปฏิทินการใช้ห้องเรียน
- สามารถจองห้องเรียน
- ยกเลิกการจองห้องเรียน
- เเก้ไขข้อมูลส่วนตัว
### Admin
- Import file Excel นักศึกษาทั้งหมดเข้าสู้ระบบ
- Import file Excel ข้อมูลคอร์สเรียนเข้าสู้ระบบ
-  เพิ่ม/เเก้ไข/ลบ ข้อมูลในระบบทั้งหมด
- ปริ้นข้อมูลเป็น PDF
- จัดการUser

## เทคโนโลยีเเละเครื่องมือที่ใช้ในการพัฒนา
- React
- Redux
- Bootstrap
- Node.js
- Express
- MySQL, Stored Procedure
- Jsonwebtoken
- bcryptjs
- moment
- react-router-dom
- react-calendar
- xlsx
- react-pdf
- figma
- Postman



## การติดตั้งระบบ

### client
1. ติดตั้ง npm
```
npm install
```
2. เปิด project
```
npm start
```

### server
1. ติดตั้ง npm
```
 npm install
```
2. สร้าง Database เเละ สร้าง table ใน Database
```

CREATE TABLE Subject (
    subj_code VARCHAR(20) PRIMARY KEY,
    subj_name VARCHAR(50)
);

CREATE TABLE RoomType (
    roomtype_id INT(20) AUTO_INCREMENT PRIMARY KEY,
    roomtype_name VARCHAR(20) UNIQUE
);

CREATE TABLE Room (
    room_id INT(20) PRIMARY KEY,
    roomtype_id INT(20),
    capacity INT(10),
    building INT(10),
    FOREIGN KEY (roomtype_id) REFERENCES RoomType(roomtype_id)
);

CREATE TABLE Course (
    course_id VARCHAR(20) PRIMARY KEY,
    subj_code VARCHAR(20),
    room_id INT(20),
    Years VARCHAR(11),
    Term VARCHAR(11),
    day VARCHAR(11),
    time VARCHAR(11),
    FOREIGN KEY (subj_code) REFERENCES Subject(subj_code),
    FOREIGN KEY (room_id) REFERENCES Room(room_id)
);
CREATE TABLE Major (
    major_id INT(20) PRIMARY KEY,
    major_name VARCHAR(50)
);

CREATE TABLE Student (
    std_code VARCHAR(20) PRIMARY KEY,
    major_id INT(20),
    std_name VARCHAR(50),
    FOREIGN KEY (major_id) REFERENCES Major(major_id)
);

CREATE TABLE STD_REG_COURSE (
    std_code VARCHAR(20),
    course_id VARCHAR(20),
    PRIMARY KEY (std_code, course_id),
    FOREIGN KEY (std_code) REFERENCES Student(std_code),
    FOREIGN KEY (course_id) REFERENCES Course(course_id)
);
CREATE TABLE Lecturer (
    lect_id VARCHAR(20) PRIMARY KEY,
    lect_name VARCHAR(50)
);

CREATE TABLE Teach (
    lect_id VARCHAR(20),
    course_id VARCHAR(20),
    PRIMARY KEY (lect_id, course_id),
    FOREIGN KEY (lect_id) REFERENCES Lecturer(lect_id),
    FOREIGN KEY (course_id) REFERENCES Course(course_id)
);
CREATE TABLE Calendar (
    Years INT(20),
    Term INT(5),
    date_begin DATE,
    date_end DATE,
    PRIMARY KEY (Years, Term)
);

CREATE TABLE Users (
    user_id VARCHAR(20) PRIMARY KEY,
    password VARCHAR(255),
    user_name VARCHAR(50),
    role ENUM('user', 'admin') DEFAULT 'user'
);

CREATE TABLE Reservation (
    reservation_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(50),
    course_id VARCHAR(20),
    room_id INT(20),
    status_code VARCHAR(20),
    Tran_dt VARCHAR(20),
    start_date DATE,
    end_date VARCHAR(11),  
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (course_id) REFERENCES Course(course_id),
    FOREIGN KEY (room_id) REFERENCES Room(room_id)
);

CREATE TABLE Reservation_detail (
    reservation_id VARCHAR(255),
    reservation_date DATE,
    reservation_time VARCHAR(11),
    PRIMARY KEY (reservation_id, reservation_date, reservation_time), 
    FOREIGN KEY (reservation_id) REFERENCES Reservation(reservation_id)
);

```
3. สร้าง Stored Procedure ใน Database
```

-- STO PROCEDURE
DELIMITER //
CREATE PROCEDURE `getAllSchedule`(
  IN lect_id_db INT,
  IN course_id_db VARCHAR(20),  
  IN start_date DATE, 
  IN end_date DATE,
  IN roomtype_id_db INT,
  IN year_db INT, -- เพิ่มพารามิเตอร์ year_db
  IN term_db INT   -- เพิ่มพารามิเตอร์ term_db
)
BEGIN
-- --------------- อาจารย์------------------------

-- ข้อ 1: ดึงข้อมูลตารางสอนของอาจารย์
  SELECT c.day, c.time
  FROM Teach t
  JOIN Course c ON t.course_id = c.course_id
  WHERE t.lect_id = lect_id_db
    AND c.Years = year_db -- ค้นหาจาก year_db
    AND c.Term = term_db; -- ค้นหาจาก term_db
  
  -- ข้อ 2: ดึงข้อมูลการจองห้องของอาจารย์
  SELECT rd.reservation_date, rd.reservation_time
FROM Reservation r
JOIN Reservation_detail rd ON r.reservation_id = rd.reservation_id
WHERE r.user_id = lect_id_db
  AND rd.reservation_date BETWEEN start_date AND end_date;
    
-- --------------- นักเรียน------------------------

  -- ข้อ 3: ดึงข้อมูลวันว่างของนักเรียนทุกคนในคอร์สนี้ 
  SELECT c.day, c.time
  FROM course c
  WHERE (c.course_id = course_id_db)
     OR (c.course_id IN (
        SELECT course_id
        FROM std_reg_course
        WHERE std_code IN (
           SELECT std_code
           FROM std_reg_course
           WHERE course_id = course_id_db
        )
     ))
    AND c.Years = year_db -- ค้นหาจาก year_db
    AND c.Term = term_db; -- ค้นหาจาก term_db
  
  -- ข้อ 4: ดึงข้อมูลการจองห้องเพิ่มเติมของนักเรียนทุกคนในคลาส
  SELECT rd.reservation_date, rd.reservation_time
FROM Reservation r
JOIN std_reg_course sr ON r.course_id = sr.course_id
JOIN Reservation_detail rd ON r.reservation_id = rd.reservation_id
WHERE sr.std_code IN (
  SELECT std_code
  FROM std_reg_course
  WHERE course_id = course_id_db
) AND rd.reservation_date BETWEEN start_date AND end_date;
  
  -- --------------- ห้องเรียน------------------------
  -- 5: ดึงข้อมูลห้องที่ตรงกับ roomtype_id จากฐานข้อมูล
  SELECT room_id FROM Room WHERE roomtype_id = roomtype_id_db;
  
  -- 6: ข้อมูลคอร์สทั้งหมดที่ใช้ห้องตามตารางสอนปกติ
  SELECT c.room_id, c.day, c.time
  FROM Course c
  WHERE c.room_id IN (
    SELECT room_id
    FROM Room
    WHERE roomtype_id = roomtype_id_db
  )
  AND c.Years = year_db -- ค้นหาจาก year_db
  AND c.Term = term_db; -- ค้นหาจาก term_db

--  7: หาวันเวลาว่างของห้องเรียนนอกเหนือจากตารางสอนปกติของห้องที่ตรงกับ roomtype_id
  SELECT r.room_id, rd.reservation_date, rd.reservation_time
FROM Reservation r
JOIN Reservation_detail rd ON r.reservation_id = rd.reservation_id
WHERE r.room_id IN (
  SELECT room_id
  FROM Room
  WHERE roomtype_id = roomtype_id_db
) AND rd.reservation_date BETWEEN start_date AND end_date;
  

END //
DELIMITER ;

```
4. เปิด project
```
npm start
```

## ขั้นตอนการทำงานระบบ
### Admin
1.  เพิ่มชนิดห้อง (Roomtype)     เช่น ห้องเรียน,ห้องประชุม,ห้องสอบ
2.  เพิ่มห้องเรียน (Room)             เช่น ห้อง4222, ห้อง4223
3. เพิ่มปีเทอมการศึกษา (YearTerm)
4. Import Student
5. Import Course


## รูปภาพตัวอย่างระบบ
Login Page:
![enter image description here](https://github.com/AoneDev2001/Classroom-Reservation-System/blob/main/%E0%B9%80%E0%B8%A5%E0%B9%88%E0%B8%A1%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%A3%E0%B8%B9%E0%B8%9B%20Demo%20%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A/Login%20Page.png?raw=true)

Calendar Page:
![enter image description here](https://github.com/AoneDev2001/Classroom-Reservation-System/blob/main/%E0%B9%80%E0%B8%A5%E0%B9%88%E0%B8%A1%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%A3%E0%B8%B9%E0%B8%9B%20Demo%20%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A/Calendar%20Page.png?raw=true)

Booking Page:
![enter image description here](https://github.com/AoneDev2001/Classroom-Reservation-System/blob/main/%E0%B9%80%E0%B8%A5%E0%B9%88%E0%B8%A1%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%A3%E0%B8%B9%E0%B8%9B%20Demo%20%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A/Booking%20Page%20.png?raw=true)

Booking Page
![enter image description here](https://github.com/AoneDev2001/Classroom-Reservation-System/blob/main/%E0%B9%80%E0%B8%A5%E0%B9%88%E0%B8%A1%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%A3%E0%B8%B9%E0%B8%9B%20Demo%20%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A/Booking%20Page%202.png?raw=true)

Import Course Page :
![enter image description here](https://github.com/AoneDev2001/Classroom-Reservation-System/blob/main/%E0%B9%80%E0%B8%A5%E0%B9%88%E0%B8%A1%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%A3%E0%B8%B9%E0%B8%9B%20Demo%20%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A/Import%20Course%20Page1.png?raw=true)

Import Course Page 
![enter image description here](https://github.com/AoneDev2001/Classroom-Reservation-System/blob/main/%E0%B9%80%E0%B8%A5%E0%B9%88%E0%B8%A1%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%A3%E0%B8%B9%E0%B8%9B%20Demo%20%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A/Import%20Course%20Page%202.png?raw=true)

Import Student Page:
![enter image description here](https://github.com/AoneDev2001/Classroom-Reservation-System/blob/main/%E0%B9%80%E0%B8%A5%E0%B9%88%E0%B8%A1%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%A3%E0%B8%B9%E0%B8%9B%20Demo%20%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A/Import%20Student%20Page%201.png?raw=true)

Import Student Page
![enter image description here](https://github.com/AoneDev2001/Classroom-Reservation-System/blob/main/%E0%B9%80%E0%B8%A5%E0%B9%88%E0%B8%A1%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%A3%E0%B8%B9%E0%B8%9B%20Demo%20%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A/Import%20Student%20Page%202.png?raw=true)

Management Page:
![enter image description here](https://github.com/AoneDev2001/Classroom-Reservation-System/blob/main/%E0%B9%80%E0%B8%A5%E0%B9%88%E0%B8%A1%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%A3%E0%B8%B9%E0%B8%9B%20Demo%20%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%9A/Management%20Page.png?raw=true)
