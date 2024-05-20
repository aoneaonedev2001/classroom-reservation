import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentYearTerm } from "../../redux/authSlice";
import "./MyCalendar.css";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  readreservationByRoomid,
  readuseRoomByRoomidYereTerm,
} from "../../api/reservationApi";
import { readAllRoomsType, readAllroomByRoomtype } from "../../api/roomApi";

const MyCalendar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const findYearTerm = useSelector((state) => state.auth.findYearTerm);

  const [events, setEvents] = useState([]);
  const [roomtype_id, setRoomtype_id] = useState([]); // 1 fetch dataมาลง roomtype_id
  const [rooms, setRooms] = useState([]); // 2 fetch dataมาลง room
  const [room_id, setRoom_id] = useState(""); // 3 เลือกห้องนำมาเเสดงใน calendar

  useEffect(() => {
    dispatch(fetchCurrentYearTerm());
  }, [dispatch]);

  // 1 fetch dataมาลง roomtype_id
  useEffect(() => {
    readAllRoomsType()
      .then((res) => {
        setRoomtype_id(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);

  // 2 fetch dataมาลง room
  const handleRoomTypeChange = (e) => {
    const id = e.target.value;
    readAllroomByRoomtype(id)
      .then((res) => {
        setRooms(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  useEffect(() => {
    setEvents([]); // เคลียร์ค่า events เมื่อมีการเปลี่ยนแปลงใน roomtype_id หรือ rooms
  }, [roomtype_id, rooms]);

  function findWeekdayInRange(startDate, endDate, targetWeekday) {
    const weekdays = [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const result = [];

    // วนลูปผ่านทุกวันในช่วงเวลาที่กำหนด
    while (start <= end) {
      if (start.getDay() === weekdays.indexOf(targetWeekday)) {
        // ถ้าเป็นวันที่ตรงกับวันในสัปดาห์ที่กำหนด
        const formattedDate = start.toISOString().split("T")[0]; // แปลงให้อยู่ในรูปแบบ "yyyy-MM-dd"
        result.push(formattedDate); // เพิ่มวันที่ลงในอาร์เรย์
      }
      start.setDate(start.getDate() + 1); // เลื่อนไปยังวันถัดไป
    }

    return result;
  }

  useEffect(() => {
    if (user && user.token && room_id && findYearTerm) {
      // 1ดึงข้อมูลการใช้ห้องตามตารางสอนปกติ
      readuseRoomByRoomidYereTerm(
        user.token,
        room_id,
        findYearTerm.Years,
        findYearTerm.Term
      )
        .then((res) => {
          const formattedStartDate = new Date(findYearTerm.date_begin)
            .toISOString()
            .split("T")[0];
          const formattedEndDate = new Date(findYearTerm.date_end)
            .toISOString()
            .split("T")[0];

          const events = res.data
            .map((item) => {
              const resultDates = findWeekdayInRange(
                formattedStartDate,
                formattedEndDate,
                item.day
              );

              const convertedEvents = resultDates.map((date) => {
                return {
                  title: item.subj_code,
                  start: date,
                  allDay: true,
                  color: item.time === "AM" ? "#3F9BF0" : "#FF6F00",
                };
              });

              return convertedEvents;
            })
            .flat();

          setEvents(events);

          // 2ดึงข้อมูลการจองห้อง
          readreservationByRoomid(user.token, room_id)
            .then((res) => {
              const convertedEventsFromReservation = res.data.map(
                (reservation) => {
                  return {
                    title:
                      reservation.user_name +
                      " " +
                      reservation.reservation_time,
                    start: reservation.reservation_date,
                    allDay: true,
                    color:
                      reservation.reservation_time === "AM"
                        ? "#5cf74e"
                        : "#5cf74e",
                  };
                }
              );
              setEvents((prevEvents) => [
                ...prevEvents,
                ...convertedEventsFromReservation,
              ]);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user, room_id, findYearTerm]);

  return (
    <>
      <h1 className="big-title-custome text-center">ปฏิทินการใช้ห้อง</h1>
      <div className="container-main-noborder">
        <h3 className="title ms-3">ค้นหาห้อง</h3>

        <div className="container-main mb-5">
          <div className="row">
            <div className="col text-center mt-4 mb-4">
              <label htmlFor="roomtype_id" className="dec">
                ชนิดห้อง:
              </label>
              <select
                className="select-custom2 ms-2 "
                name="roomtype_id"
                onChange={handleRoomTypeChange} // เรียกใช้งาน handleRoomTypeChange เมื่อมีการเลือกชนิดห้องใหม่
              >
                <option>เลือก...</option>
                {roomtype_id.map((item, index) => (
                  <option key={index} value={item.roomtype_id}>
                    {item.roomtype_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col text-center mt-4 mb-4">
              <label htmlFor="room_id" className="dec ">
                ห้อง:
              </label>
              <select
                className="select-custom2 ms-2"
                name="room_id"
                onChange={(e) => setRoom_id(e.target.value)}
              >
                <option value="">เลือก...</option>
                {rooms.map((room, index) => (
                  <option key={index} value={room.room_id}>
                    {room.room_id}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <h3 className="title ms-3 mb-2">
          ห้อง :<span className="editspan"> {room_id}</span>
        </h3>
        <div className="container-main mb-5">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
          />
        </div>
      </div>
    </>
  );
};

export default MyCalendar;
