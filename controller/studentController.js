import express from "express";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import Student from "../models/studentModel.js";
import Hostels from "../models/hostelModel.js";
import Outings from "../models/outingModel.js";
import {dirname} from "path";
import path from "path";
import { fileURLToPath } from "url";
import { symlink } from "fs";
import { error } from "console";

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticPath = path.join(__dirname, "..", "public2");
// console.log(staticPath); // -->D:\stepcone\student_backend
// console.log(__dirname);  --> includes D:\stepcone\student_backend\controller


var uniqueStudentRegNo;

// *** Middleware functions to create staticFiles
const serveStaticFiles = express.static(staticPath);

// @desc send Student Login page
// @ route GET /api/students/loginPage
// @access public
const sendLoginPage = asyncHandler(async (req, res) => {
  res.sendFile(path.join(staticPath, 'student_login.html'));
}); 

// @desc send Student Register page
// @ route GET /api/students/registerPage
// @access public
const sendRegisterPage = asyncHandler(async (req, res) => {
  res.sendFile(path.join(staticPath, 'student_register.html'));
}); 


// @desc Register student
// @ route POST /api/students/register
// @access public
const registerStudent = asyncHandler(async (req, res) => {
  const { name, jntu_no, year, parent_phone_number, parent_email, password } = req.body;
  if (!name || !jntu_no || !year || !parent_phone_number || !parent_email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory.");
  }

  const existStudent = await Student.findOne({jntu_no});

  if(existStudent){
    res.json({message : "Student already exists."});
  }
  else{
    const hashedPassword = await bcrypt.hash(password, 5);
    const student = await Student.create({
      name,
      jntu_no,
      year,
      parent_phone_number,
      parent_email,
      password : hashedPassword,
      hostelID : "", // set empty my default
      floor : "", // set empty my default
      room : "", // set empty my default
      roomType : "", // set empty my default
    });
  
    console.log(`Student Created ${student}`);
    res.json({ message: "Register the student" });
  }
});

// @desc Login Student page 
// @route POST /api/students/loginStudent
// @access public
const loginStudent = asyncHandler( async(req, res) => {
  const {jntu_no, password} = req.body;
  if(!jntu_no || !password){
    res.status(400).json({message : "All fields are mandatory."});
  }
  const student = await Student.findOne({jntu_no});
  
  if(student && await bcrypt.compare(password, student.password)){
    uniqueStudentRegNo = jntu_no;
    console.log(`uniqueStudentRegNo = ${uniqueStudentRegNo}`);
    res.sendFile(path.join(staticPath, 'student_main.html'));
  }
  else{
    // res.send("Invalid Credentials.");
    res.sendFile(path.join(staticPath, 'student_main.html'));
  }
});



//@desc send alloted hostels documents to index2.html
//@route GET /api/students/getHostelAllocation
//@access public
const sendHostelAllocation = asyncHandler(async(req, res) =>{
  const documents = await Hostels.find({});
  res.status(200).json(documents);
  console.log("Documents sent succesfull.");
})

// @desc send hostel sellection page
// @ route GET /api/students/selectHostel
// @access public
const selectHostel = asyncHandler(async (req, res) => {
  res.sendFile(path.join(staticPath, 'index2.html'));
});

// @desc send outing permission page
// @ route GET /api/students/outingPermission
// @access public
const outingPermission = asyncHandler( async(req,res)=>{
  res.sendFile(path.join(staticPath, 'index4.html'));
});

// @des Accept hostel allocation
// @route POST /api/students/acceptHostel
// @access public
// *** Route handler to handle < Hostel allocation request >
const acceptHostelID = asyncHandler ( async (req, res) => {
  // console.log(`Allocated ID is : ${req.body["hostelID"]}`); 

  const student = await Student.findOne({jntu_no : uniqueStudentRegNo});
  if(student){
    // update hostel ID in *StudenCollection* database & save the new added data. 
    student.hostelID = req.body["hostelID"];
    await student.save();

    res.sendFile(path.join(staticPath, 'index3.html'));
  }
  else{
      // If student not found, send a 404 Not Found response
      return res.status(404).json({ message: "Student not found"});
  }
  
  // res.status(200).json({message : "Hostel Allocated Succesfully."});
});


// @des Send student Name
// @route GET /api/students/studentName
// @access public
const sendStudentName = asyncHandler( async(req, res) => {
  const student = await Student.findOne({jntu_no : uniqueStudentRegNo});
  if(student){
    res.json({name : student.name, hostelID : student.hostelID});
  }
  else{
      // If student not found, send a 404 Not Found response
      return res.status(404).json({ message: "Student not found" });
  }
});


// @des Accept Room allocation
// @route POST /api/students/acceptRoom
// @access public
const acceptRoom = asyncHandler( async (req, res) => {
  console.log(`Allocated Room Detail : ${req.body["floor"]}  ${req.body["room"]}  ${req.body["roomType"]}`);
  
  const student = await Student.findOne({jntu_no : uniqueStudentRegNo});
  if(student){
    // update room allocation detail in *StudenCollection* database & save the new added data. 
    student.floor = req.body["floor"];
    student.room = req.body["room"];
    student.roomType = req.body["roomType"];
    await student.save();

    res.status(200).json({ message: "Room is allocated and data is stored." });
  }
  else{
      // If student not found, send a 404 Not Found response
      return res.status(404).json({ message: "Student not found" });
  }
});


// @des store the outings data to the database
// @route POST /api/students/acceptOutingDetails
// @access public
const outingDetails = asyncHandler(async(req, res) =>{
  const {jntu_no, permissionType, outDate,outTime, inDate, inTime, reason} = req.body;

  const outing = await Outings.create({
    jntu_no,
    permissionType,
    outDate,
    outTime,
    inDate,
    inTime,
    reason,
    status : 'Pending'
  });

  if(outing){
    res.status(200).json({message : "Outing Details are stored successfully."});
  }
});

// @des send the outing history w.r.t to student_ID
// @route GET /api/students/sendOutingHistory
// @access public
const sendOutingHistory = asyncHandler( async(req, res) =>{ 
  const outings = await Outings.find({jntu_no: uniqueStudentRegNo});

  if(outings.length > 0){
    res.status(200).json(outings.map(outing =>({
      jntu_no : outing.jntu_no,
      permissionType : outing.permissionType,
      outDate : outing.outDate,
      outTime : outing.outTime,
      inDate : outing.inDate,
      inTime : outing.inTime,
      reason : outing.reason,
      status : outing.status})));
  }
  else{
    res.status(404).json({message : "No History is available."})
  }
});

export {loginStudent,
  registerStudent,
  selectHostel,
  acceptHostelID,
  acceptRoom,
  sendStudentName,
  sendHostelAllocation,
  outingPermission,
  outingDetails,
  sendOutingHistory,
  sendLoginPage,
  sendRegisterPage};

