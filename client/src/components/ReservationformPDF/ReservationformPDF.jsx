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

const ReservationformPDF = ({ selectedItem, faculty, major_name}) => {
    
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>แบบฟอร์มขอใช้ห้องเรียน</Text>
          <Text>ห้อง: {selectedItem.room_id}</Text>
          <Text>ผู้จอง: อาจารย์ {selectedItem.user_name} สาขาวิชา: {major_name } คณะ: {faculty} </Text>
          <Text>มหาวิทยาลัยราชภัฏสวนสุนันทา   เบอร์โทรศัพท์ที่ติดต่อได้:  </Text>
          <Text>จำนวนผู้ใช้ห้อง {selectedItem.capacity} คน</Text>
          <Text>วันที่ขอใช้ห้อง: {moment(selectedItem.reservation_date).format('LL')} เวลา:{selectedItem.reservation_time === "AM" ? "08:00 - 12:00" : "12:00 - 18:00"} </Text>
          <Text>มีความประสงค์ใช้ห้องเพื่อ:การเรียนการสอนรายวิชา  </Text>
          <Text>ลงชื่อ: {selectedItem.user_name} ผู้จอง</Text>
          <Text>เรียน รองคณบดีฝ่ายบริหาร เพื่อโปรดพิจารณา</Text>
          <Text>ลงชื่อ: {selectedItem.user_name} เจ้าหน้าที่</Text>
          <Text>.......................</Text>
          <Text>รองคณบดีฝ่ายบริหาร</Text>
          
        </View>
      </Page>
    </Document>
  );
};

export default ReservationformPDF;
