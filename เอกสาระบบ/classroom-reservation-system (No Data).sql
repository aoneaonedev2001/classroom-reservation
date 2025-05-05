-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Apr 27, 2025 at 10:12 AM
-- Server version: 9.0.1
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `classroom-reservation-system`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`%` PROCEDURE `getAllSchedule` (IN `lect_id_db` INT, IN `course_id_db` VARCHAR(20), IN `start_date` DATE, IN `end_date` DATE, IN `roomtype_id_db` INT, IN `year_db` INT, IN `term_db` INT)   BEGIN
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
  

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `Calendar`
--

CREATE TABLE `Calendar` (
  `Years` int NOT NULL,
  `Term` int NOT NULL,
  `date_begin` date DEFAULT NULL,
  `date_end` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Calendar`
--

INSERT INTO `Calendar` (`Years`, `Term`, `date_begin`, `date_end`) VALUES
(2568, 2, '2025-01-12', '2025-07-30');

-- --------------------------------------------------------

--
-- Table structure for table `Course`
--

CREATE TABLE `Course` (
  `course_id` varchar(20) NOT NULL,
  `subj_code` varchar(20) DEFAULT NULL,
  `room_id` int DEFAULT NULL,
  `Years` varchar(11) DEFAULT NULL,
  `Term` varchar(11) DEFAULT NULL,
  `day` varchar(11) DEFAULT NULL,
  `time` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Lecturer`
--

CREATE TABLE `Lecturer` (
  `lect_id` varchar(20) NOT NULL,
  `lect_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Major`
--

CREATE TABLE `Major` (
  `major_id` int NOT NULL,
  `major_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Reservation`
--

CREATE TABLE `Reservation` (
  `reservation_id` varchar(255) NOT NULL,
  `user_id` varchar(50) DEFAULT NULL,
  `course_id` varchar(20) DEFAULT NULL,
  `room_id` int DEFAULT NULL,
  `status_code` varchar(20) DEFAULT NULL,
  `Tran_dt` varchar(20) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Reservation_detail`
--

CREATE TABLE `Reservation_detail` (
  `reservation_id` varchar(255) NOT NULL,
  `reservation_date` date NOT NULL,
  `reservation_time` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Room`
--

CREATE TABLE `Room` (
  `room_id` int NOT NULL,
  `roomtype_id` int DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `building` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `RoomType`
--

CREATE TABLE `RoomType` (
  `roomtype_id` int NOT NULL,
  `roomtype_name` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `RoomType`
--

INSERT INTO `RoomType` (`roomtype_id`, `roomtype_name`) VALUES
(1, 'ห้องเรียน');

-- --------------------------------------------------------

--
-- Table structure for table `STD_REG_COURSE`
--

CREATE TABLE `STD_REG_COURSE` (
  `std_code` varchar(20) NOT NULL,
  `course_id` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Student`
--

CREATE TABLE `Student` (
  `std_code` varchar(20) NOT NULL,
  `major_id` int DEFAULT NULL,
  `std_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Subject`
--

CREATE TABLE `Subject` (
  `subj_code` varchar(20) NOT NULL,
  `subj_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Teach`
--

CREATE TABLE `Teach` (
  `lect_id` varchar(20) NOT NULL,
  `course_id` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `user_id` varchar(20) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_name` varchar(50) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`user_id`, `password`, `user_name`, `role`) VALUES
('aone555aone', '$2a$10$bh12l4nXaypxTzBfrvipgezffk2C.TsJoFtk/6FziI4lFszZI893O', 'admin', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Calendar`
--
ALTER TABLE `Calendar`
  ADD PRIMARY KEY (`Years`,`Term`);

--
-- Indexes for table `Course`
--
ALTER TABLE `Course`
  ADD PRIMARY KEY (`course_id`),
  ADD KEY `subj_code` (`subj_code`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `Lecturer`
--
ALTER TABLE `Lecturer`
  ADD PRIMARY KEY (`lect_id`);

--
-- Indexes for table `Major`
--
ALTER TABLE `Major`
  ADD PRIMARY KEY (`major_id`);

--
-- Indexes for table `Reservation`
--
ALTER TABLE `Reservation`
  ADD PRIMARY KEY (`reservation_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `Reservation_detail`
--
ALTER TABLE `Reservation_detail`
  ADD PRIMARY KEY (`reservation_id`,`reservation_date`,`reservation_time`);

--
-- Indexes for table `Room`
--
ALTER TABLE `Room`
  ADD PRIMARY KEY (`room_id`),
  ADD KEY `roomtype_id` (`roomtype_id`);

--
-- Indexes for table `RoomType`
--
ALTER TABLE `RoomType`
  ADD PRIMARY KEY (`roomtype_id`),
  ADD UNIQUE KEY `roomtype_name` (`roomtype_name`);

--
-- Indexes for table `STD_REG_COURSE`
--
ALTER TABLE `STD_REG_COURSE`
  ADD PRIMARY KEY (`std_code`,`course_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `Student`
--
ALTER TABLE `Student`
  ADD PRIMARY KEY (`std_code`),
  ADD KEY `major_id` (`major_id`);

--
-- Indexes for table `Subject`
--
ALTER TABLE `Subject`
  ADD PRIMARY KEY (`subj_code`);

--
-- Indexes for table `Teach`
--
ALTER TABLE `Teach`
  ADD PRIMARY KEY (`lect_id`,`course_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `RoomType`
--
ALTER TABLE `RoomType`
  MODIFY `roomtype_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Course`
--
ALTER TABLE `Course`
  ADD CONSTRAINT `Course_ibfk_1` FOREIGN KEY (`subj_code`) REFERENCES `Subject` (`subj_code`),
  ADD CONSTRAINT `Course_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `Room` (`room_id`);

--
-- Constraints for table `Reservation`
--
ALTER TABLE `Reservation`
  ADD CONSTRAINT `Reservation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  ADD CONSTRAINT `Reservation_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `Course` (`course_id`),
  ADD CONSTRAINT `Reservation_ibfk_3` FOREIGN KEY (`room_id`) REFERENCES `Room` (`room_id`);

--
-- Constraints for table `Reservation_detail`
--
ALTER TABLE `Reservation_detail`
  ADD CONSTRAINT `Reservation_detail_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `Reservation` (`reservation_id`);

--
-- Constraints for table `Room`
--
ALTER TABLE `Room`
  ADD CONSTRAINT `Room_ibfk_1` FOREIGN KEY (`roomtype_id`) REFERENCES `RoomType` (`roomtype_id`);

--
-- Constraints for table `STD_REG_COURSE`
--
ALTER TABLE `STD_REG_COURSE`
  ADD CONSTRAINT `STD_REG_COURSE_ibfk_1` FOREIGN KEY (`std_code`) REFERENCES `Student` (`std_code`),
  ADD CONSTRAINT `STD_REG_COURSE_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `Course` (`course_id`);

--
-- Constraints for table `Student`
--
ALTER TABLE `Student`
  ADD CONSTRAINT `Student_ibfk_1` FOREIGN KEY (`major_id`) REFERENCES `Major` (`major_id`);

--
-- Constraints for table `Teach`
--
ALTER TABLE `Teach`
  ADD CONSTRAINT `Teach_ibfk_1` FOREIGN KEY (`lect_id`) REFERENCES `Lecturer` (`lect_id`),
  ADD CONSTRAINT `Teach_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `Course` (`course_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
