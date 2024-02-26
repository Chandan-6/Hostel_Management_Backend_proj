import express from "express";
import asyncHandler from 'express-async-handler';
import Hostels from "../models/hostelModel.js";
import Students from "../models/studentModel.js";
import Outings from "../models/outingModel.js";
import Wardens from "../models/wardenModel.js";
import {dirname} from "path";
import path from "path";
import { fileURLToPath } from "url";

// import.meta.url: This gives you the URL of the current module.
// fileURLToPath(): This function converts a file URL (uniform resource locator) to a file path.
// dirname(): This function extracts the directory part of a file path.

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticPath = path.join(__dirname, "..", "public2");


/*
express.static(): This function in the Express.js framework is used to serve static files such as images, CSS files, and JavaScript files.
staticPath: This variable likely holds the path to the directory where your static files are located.
*/
const serveStaticFiles = express.static(staticPath);

//@desc register warden
//@route GET /api/warden/register
const registerWarden = asyncHandler(async(req, res)=>{
    const {user_id, password} = req.body;

    if(!user_id || !password){
        res.status(404).json({message : "All fields are mandatory"});
    }

    await Wardens.create({
        user_id,
        password
    });

    res.status(200).json({message : "warden Registration Done."});
})

//@desc send login page
//@route GET /api/warden/loginPage
const loginPage = asyncHandler(async(req, res) =>{
    res.sendFile(path.join(staticPath, 'warden_login.html'));
})


// @desc Login to warden details, and send warden_main site
// @ route POST /api/warden/loginWarden
// @access public
const loginWarden = asyncHandler(async(req, res) =>{
    const {user_id, password} = req.body;

    if(!user_id || !password){
        res.status(404).json({message : "All fields are mandatory"});
    }

    const warden = await Wardens.findOne({user_id});

    if(warden && warden.password === password){
        res.sendFile(path.join(staticPath, "warden_main.html"));
    }
    else{
        res.sendFile(path.join(staticPath, 'warden_login.html'));
    }
});


// @desc send Allocate Hostels site
// @ route GET /api/warden/allocateHostel
// @access public
const allocateHostel = asyncHandler(async(req, res) =>{
    res.sendFile(path.join(staticPath, "warden_hostel_allocation.html"));
});


// @desc Accept the allocated hostels to A/C to year
// @ route POST /api/warden/acceptHostelAllocation
// @access public
const acceptHostelAllocation = asyncHandler(async(req, res) => {
    const hostelData = req.body;
    const keys = Object.keys(hostelData);
    const values = Object.values(hostelData);

    for(let i = 0; i < keys.length; i++){  

        const query = { hostel_name: keys[i] };
        const availableHostel = await Hostels.findOne(query);
        if(availableHostel){
            availableHostel.year = values[i];
            await availableHostel.save();
        }
        else{
            const hostel = await Hostels.create({
                hostel_name : keys[i],
                year : values[i],
            });
        }
    }

    console.log("Data stored successfully.");
});


// @desc check hosteller info, beds opted
// @ route GET /api/warden/checkHostllers
// @access public
const checkHostellers = asyncHandler(async(req, res) =>{
    res.sendFile(path.join(staticPath, "warden_check_hostellers.html"));
});

// @desc Send hosteller info, beds opted
// @ route POST /api/warden/StudentDetailsByID
// @access public
const sendStudentDetailByID = asyncHandler(async(req, res) =>{
    const details = req.body;
    const student = await Students.findOne({jntu_no : details["jntu_no"]});
    console.log(`jntu_no : ${details["jntu_no"]}`);

    if(student){
        res.status(200).json({name : student.name, jntu_no : student.jntu_no, year : student.year, parent_phone_number : student.parent_phone_number, parent_email : student.parent_email, hostelID : student.hostelID, floor : student.floor, room : student.room, roomType : student.roomType});
    } else {
        // If student not found, send a 404 Not Found response
        return res.status(404).json({ message: "Student not found" });
    }
});

// @desc Send hosteller info, beds opted 
// @ route POST /api/warden/StudentDetailsByRoomNo
// @access public
const sendStudentDetailByRoomNo = asyncHandler(async(req, res) => {
    const details = req.body;
    const students = await Students.find({room : details["room"]});

    console.log(`Room details : Details retrived.`);

    if(students.length > 0){
        res.status(200).json(students.map(student => ({
            name : student.name,
            jntu_no : student.jntu_no,
            year : student.year,
            parent_phone_number : student.parent_phone_number,
            parent_email : student.parent_email,
            hostelID : student.hostelID,
            floor : student.floor,      
            room : student.room, 
            roomType : student.roomType})));
    } else{
        res.status(404).json({message : "No students were found with these Room No."})
    }
});

// @desc outing permissions
// @ route GET /api/warden/outingPermissions
// @access public
const outingPermissions = asyncHandler(async(req, res) =>{
    res.sendFile(path.join(staticPath, "warden_outing_permission.html"));
});


// @desc send outing history all
// @ route GET /api/warden/outingHistory
// @access public
const outingHistory = asyncHandler(async(req, res)=>{
    const outings = await Outings.find({});

    if(outings.length > 0){
        res.status(200).json(outings.map(outing => ({
            outingID : outing._id,
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
        res.status(404).json({message : "No history is available."});
    }
});


// @desc update student outing permission history
// @ route POST /api/warden/updatePermission
// @access public
const updatePermission = asyncHandler(async(req,res) =>{

    const {outingID, status} = req.body;
        // Validate request body
    if (!outingID || !status) {
        return res.status(400).json({ message: "Invalid request body. 'jntu_no' and 'status' are required." });
    }
    console.log(outingID + " " + status);
    const outing = await Outings.findById(outingID);

    if(outing){
        outing.status = status;
        await outing.save();
    }
    else{
        res.status(404).json({message : "Error in updating Outing Permission Status."})
    }
});


export {registerWarden,
    allocateHostel,
    checkHostellers,
    outingPermissions,
    acceptHostelAllocation,
    sendStudentDetailByID,
    sendStudentDetailByRoomNo,
    outingHistory,
    updatePermission,
    loginWarden,
    loginPage};