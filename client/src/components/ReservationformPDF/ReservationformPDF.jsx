import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import moment from 'moment';
import 'moment/locale/th';
// นำเข้า font ที่ต้องการใช้
import SarabunRegular from './THSarabunNew.ttf';

// ลงทะเบียน font
Font.register({
  family: 'Sarabun',
  src: SarabunRegular,
});

// สร้างรูปแบบ (styles) สำหรับ PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
    fontFamily: 'Sarabun', // ใช้ font ที่ลงทะเบียนไว้
    textAlign: 'center'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const ReservationformPDF = React.forwardRef(({ selectedItem, faculty, major_name }, ref) => {

  //console.log("selectedItem",selectedIte?.user_name);

  return (
    <div ref={ref} style={{ padding: '10px', fontFamily: 'Sarabun' }}>
      <h2>แบบฟอร์มขอใช้ห้องเรียน</h2>
      <p>ห้อง: {selectedItem?.room_id}</p>
      <p>ผู้จอง: อาจารย์ {selectedItem?.user_name} สาขาวิชา: {major_name} คณะ: {faculty}</p>
      <p>มหาวิทยาลัยราชภัฏสวนสุนันทา เบอร์โทรศัพท์ที่ติดต่อได้:</p>
      <p>จำนวนผู้ใช้ห้อง {selectedItem?.capacity} คน</p>
      <p>วันที่ขอใช้ห้อง: {moment(selectedItem?.reservation_date).format('LL')} เวลา: {selectedItem?.reservation_time === "AM" ? "08:00 - 12:00" : "12:00 - 18:00"}</p>
      <p>มีความประสงค์ใช้ห้องเพื่อ: การเรียนการสอนรายวิชา</p>
      <p>ลงชื่อ: {selectedItem?.user_name} ผู้จอง</p>
      <p>เรียน รองคณบดีฝ่ายบริหาร เพื่อโปรดพิจารณา</p>
      <p>ลงชื่อ: {selectedItem?.user_name} เจ้าหน้าที่</p>
      <p>.......................</p>
      <p>รองคณบดีฝ่ายบริหาร</p>
    </div>
  );
});

export default ReservationformPDF;
