import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import "./ImportCourse.css";
import { Modal, Button } from "react-bootstrap";
//redux
import { useSelector } from "react-redux";
//function
import{importCourse} from "../../api/importExcelApi"
//Ant เเจ้ง Alert
import { message } from 'antd';
import ImgExampleCourse from  '../../img/CourseExample.png'

const ImportCourse = () => {
  const user = useSelector(state => state.auth.user)
  //module
  const [showModal, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  //module  Example Data exccel
  const [showModalExample, setShowModalExample] = useState(false);
  const handleModalExampleClose = () => setShowModalExample(false);
  const handleModalExampleShow = () => setShowModalExample(true);

  //สาขายังไม่มี data ที่ยังไม่มี
  const [major_id,setMajor_id] = useState("2519");
  //const [faculty, setFaculty] = useState("เทคโนโลยีอุตสาหกรรม");
  const [major_name, setMajor_name] = useState("วิศวะกรรมคอมพิวเตอร์");

  const [subj_code, setSubj_code] = useState("");
  const [subj_name, setSubj_name] = useState("");
  const [course_id, setCourse_id] = useState(""); //(Year + Term + subj_code) 
  const [room_id, setRoom_id] = useState("");
  const [Years, setYears] = useState("");
  const [Term, setTerm] = useState("");
  const [day, setDay] = useState("");
  const [time_begin, setTime_begin] = useState("");
  const [time_end, setTime_end] = useState("");
  const [lect_id, setLect_id] = useState("");
  const [lect_name, setLect_name] = useState("");
  const [std_code, setStdCode] = useState([]);
  const [std_name, setStdName] = useState([]); 
  const [building, setBuilding] = useState("");
  

   //set courseID = (Year + Term + subj_code)
   useEffect(() => {
    setCourse_id(Years + Term + subj_code);
  }, [Years, Term, subj_code]);

  const handleSubmit =(e)=>{
    e.preventDefault();
   const value ={
    subj_code,
    subj_name,
    course_id,
    Years,
    Term,
    day,
    time_begin,
    time_end,
    lect_id,
    lect_name,
    std_code,
    std_name,
    major_id,
    major_name,
    room_id,
  };
  importCourse(user.token, value) 
  .then((res)=>{
    //alert("Import Course Success"); 
    message.loading("Loading...", 2.5).then(()=>message.success('Import คอร์สเรียนสำเร็จ', 2.5));
    handleModalClose();
  })
  .catch((error) => {
    console.log(error);
  });
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const binaryStr = reader.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Parse Year and Term from the 3rd row
        const yearTermCell = worksheet["A3"];
        if (yearTermCell) {
          const yearTerm = yearTermCell.v;
          const match = yearTerm.match(
            /ภาคการศึกษาที่ : (\d+)\s+ปีการศึกษา : (\d+)/
          );
          if (match) {
            setTerm(match[1]);
            setYears(match[2]);
          }
        }

        // Parse lecturer ID and name from the 4th row
        const lectCell = worksheet["A4"];
        if (lectCell) {
          const lect = lectCell.v;
          const match = lect.match(/ชื่อ-สกุลอาจารย์ : (\d+) - (.+)/);
          if (match) {
            setLect_id(match[1]);
            setLect_name(match[2].trim());
          }
        }

        // Parse subject code and name from the 6th row
        const subjCell = worksheet["A6"];
        if (subjCell) {
          const subj = subjCell.v;
          const match = subj.match(/ชื่อวิชา : (\w+)\s+(.+) :/);
          if (match) {
            setSubj_code(match[1]);
            setSubj_name(match[2].trim());
          }
        }

        // Parse Day, time_begin, time_end, building, and room_id from the 8th row
        const scheduleCell = worksheet["A8"];
        if (scheduleCell) {
          const schedule = scheduleCell.v;
          const match = schedule.match(
            /วันเวลาเรียน : (\S+) (\S+)-(\S+)\s+ห้องเรียน : (\d+)\/(\d+)/
          );
          if (match) {
            setDay(match[1]);
            setTime_begin(match[2]);
            setTime_end(match[3]);
            setBuilding(match[4]);
            setRoom_id(match[5]);
          }
        }

        // Start reading from row 11
        const startRow = 11;
        let dataB = [];
        let dataC = [];
        let done = false;
        for (let i = startRow; !done; i++) {
          const cellB = worksheet["B" + i];
          const cellC = worksheet["C" + i];

          if (cellB === undefined && cellC === undefined) {
            done = true; // Stop if both B and C are undefined
          } else {
            dataB.push(cellB ? cellB.v : ""); // get cell Bi value or empty string if undefined
            dataC.push(cellC ? cellC.v : ""); // get cell Ci value or empty string if undefined
          }
        }
        // filter ช่องว่างใน array ออก
        const filteredDataB = dataB.filter((item) => item !== ""); 
        const filteredDataC = dataC.filter((item) => item !== "");
        
        if(filteredDataB.length !== filteredDataC.length){
          alert('ข้อมูลในไฟล์มีโครงสร้างไม่ถูกต้อง โปรดตรวจสอบข้อมูลในไฟล์อีกครั้ง');
          return;
         } 

       

        setStdCode(filteredDataB);
        setStdName(filteredDataC);
      
          handleModalShow();
        };
        reader.readAsBinaryString(file);
      } else {
        alert("ไฟล์ไม่ถูกต้อง โปรดอัปโหลดไฟล์ Excel (.xlsx) เท่านั้น");
      }
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop});


  return (
    <div className="container-main-noborder">
      <h1 className="big-title mb-5">Import ข้อมูลการลงทะเบียนเรียน</h1>
      <p>โปรดเลือก Excel File ที่ท่านต้องการ Import</p>
      <p>*ระบบรองรับเฉพาะไฟล์ XLSX <span onClick={()=>handleModalExampleShow()} style={{color:"#3F9BF0",cursor:"pointer"}}>ดูตัวอย่าง</span> </p>
      <div className="importfile" {...getRootProps()}>
        <input {...getInputProps()} className="hidden-input" />
        <button className="btn-custom-importfile">เรียกดูไฟล์</button>
        <h2 className="decs">หรือลากมาใส่ในกล่องนี้</h2>
      </div>

      <Modal
        show={showModal}
        onHide={handleModalClose}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            <h3 className="big-title">Import ข้อมูลการลงทะเบียนเรียน</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3 className="titleModal2 text-center ">
            ปีการศึกษา : {Years} ภาคการศึกษาที่ : {Term}
          </h3>
          <div className="container-modal text-center" >
            <div className="row">
              <div className="col text-start">
                <h3 className="title">รหัสวิชา</h3>
                <h3 className="dec">{subj_code}</h3>
                <h3 className="title">รหัสอาจารย์</h3>
                <h3 className="dec">{lect_id}</h3>
                <h3 className="title">วันเวลาเรียน</h3>
                <h3 className="dec">
                  {day} {time_begin}-{time_end}
                </h3>
              </div>
              <div className="col text-start">
                <h3 className="title">ชื่อวิชา</h3>
                <h3 className="dec">{subj_name}</h3>
                <h3 className="title">ชื่อ-นามสกุลอาจารย์</h3>
                <h3 className="dec">{lect_name}</h3>
                <h3 className="title">ห้องเรียน</h3>
                <h3 className="dec">
                  {building}/{room_id}
                </h3>
              </div>
            </div>

            <table className="table table-bordered shadow custom-table mt-3" >
              <thead>
                <tr>
                  <th className="titleTh" scope="col">ที่</th>
                  <th className="titleTh" scope="col">รหัสนักศึกษา</th>
                  <th className="titleTh" scope="col">ชื่อ-สกุลนักศึกษา</th>
                </tr>
              </thead>
              <tbody>
                {std_code.map((code, index) => (
                  <tr key={index}>
                    <th className="titleTd" scope="row">{index + 1}</th>
                    <td className="titleTd">{code}</td>
                    <td className="titleTd">{std_name[index]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center w-100">
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Example Data */}
      <Modal show={showModalExample} onHide={handleModalExampleClose} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            <h3 className="big-title">Example File</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-modal text-center">
             <img src={ImgExampleCourse }  alt="" className="" />
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center w-100">
          <Button variant="secondary" onClick={handleModalExampleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ImportCourse;
