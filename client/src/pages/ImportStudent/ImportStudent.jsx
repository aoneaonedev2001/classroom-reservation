import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { Modal, Button } from "react-bootstrap";
//redux
import { useSelector } from "react-redux";  
//function
import{importStudent} from "../../api/importExcelApi"
import './ImportStudent.css'
//Ant เเจ้ง Alert
import { message } from 'antd';
import ImgExampleAllStudent from  '../../img/AllStudentExample.png'


const ImportStudent = () => {
  const user = useSelector(state => state.auth.user)
  //module
  const [showModal, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

   //module  Example Data exccel
   const [showModalExample, setShowModalExample] = useState(false);
   const handleModalExampleClose = () => setShowModalExample(false);
   const handleModalExampleShow = () => setShowModalExample(true);
  
  //สาขายังไม่มี
  const [major_id,setMajor_id] = useState("2519");
  const [faculty, setFaculty] = useState("เทคโนโลยีอุตสาหกรรม");
  const [major_name, setMajor_name] = useState("วิศวะกรรมคอมพิวเตอร์");
  const [std_code, setStdCodes] = useState([]);
  const [std_name, setStdNames] = useState([]);
  
  

  const handleSubmit =(e)=>{
   

    e.preventDefault();
   const value ={
   major_id,
   major_name,
   std_code,
   std_name
  };
  importStudent(user.token, value) 
  .then((res)=>{
    
    //alert("Import Student Success");
    message.loading("Loading...", 2.0).then(()=>message.success('Import นักเรียนสำเร็จ', 2.5)); 
    handleModalClose();
  })
  .catch((error) => {
    console.log(error);
  });
  };

  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      const binaryStr = reader.result;

    // Check if the file is in the correct format (Excel .xlsx)
    const fileType = acceptedFiles[0].type;
    if (fileType !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      alert("ไฟล์ไม่ถูกต้อง โปรดอัปโหลดไฟล์ Excel (.xlsx) เท่านั้น");
      return; // Stop processing the file
    }
   

    const workbook = XLSX.read(binaryStr, { type: "binary" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const startRow = 8;
      const dataB = [];
      const dataE = [];
      for (let i = startRow; i <= 200; i++) {
        //todo เเก้ปัญการด้วยการloop 200 ไปก่อนจริงๆต้อง undefined
        const cellB = worksheet["B" + i];
        const cellC = worksheet["C" + i];
        const cellD = worksheet["D" + i];
        const cellE = worksheet["E" + i];

        const combinedCode =
          (cellB ? cellB.v : "") +
          (cellC ? cellC.v : "") +
          (cellD ? cellD.v : ""); // combine cell Bi, Ci, Di values or empty string if undefined
        dataB.push(combinedCode);
        dataE.push(cellE ? cellE.v : ""); // get cell Ei value or empty string if undefined
      }
       
      // filter ช่องว่างใน array ออก
      const filteredDataB = dataB.filter((item) => item !== "");
      const filteredDataE = dataE.filter((item) => item !== "");
   

        //console.log("filteredDataB",filteredDataB);
       if(filteredDataB.length !== filteredDataE.length){
        alert('ข้อมูลในไฟล์มีโครงสร้างไม่ถูกต้อง โปรดตรวจสอบข้อมูลในไฟล์อีกครั้ง');
        return;
       }
       
      //  // check กันเอาไฟล์ import course มาใช้กับ import student
      //  const nothaveCharacters = /[^\d]/.test(filteredDataE); //ดักตัวอักศร
      //  if (nothaveCharacters) {
      //   alert('ข้อมูลในไฟล์มีโครงสร้างไม่ถูกต้อง โปรดตรวจสอบข้อมูลในไฟล์อีกครั้ง');
      //   return;
      // }
     

      setStdCodes(filteredDataB);//2.set ลง state
      setStdNames(filteredDataE);
      
   

      handleModalShow();
    };
    reader.readAsBinaryString(acceptedFiles[0]);
   
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });


  return (
    <div className="container-main-noborder">
      <h1 className="big-title mb-5">Import ข้อมูลนักศึกษาใหม่</h1>
      <p>โปรดเลือก Excel File ที่ท่านต้องการ Import</p>
      <p>*ระบบรองรับเฉพาะไฟล์ XLSX <span onClick={()=>handleModalExampleShow()} style={{color:"#3F9BF0",cursor:"pointer"}}>ดูตัวอย่าง</span> </p>
      <div className="importfile" {...getRootProps()}>
        <input {...getInputProps()} className="hidden-input" />
        <button className="btn-custom-importfile">เรียกดูไฟล์</button>
        <h2 className="decs">หรือลากมาใส่ในกล่องนี้</h2>
      </div>
      
      <Modal show={showModal} onHide={handleModalClose} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            <h3 className="big-title">Import ข้อมูลนักศึกษาใหม่</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-modal text-center">
            <div className="row">
              <div className="col text-start">
                <h3 className="title">คณะ</h3>
                <h3 className="dec">{faculty}</h3>
              </div>
              <div className="col text-start">
                <h3 className="title">สาขาวิชา</h3>
                <h3 className="dec">{major_name}</h3>
              </div>
            </div>

            <table className="table table-bordered shadow custom-table mt-3">
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
                    <td className="titleTd" scope="row">{index + 1}</td>
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
          <Button variant="primary" onClick={handleSubmit} >บันทึกข้อมูล</Button>
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
             <img src={ImgExampleAllStudent }  alt="" className="" />
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

export default ImportStudent;
