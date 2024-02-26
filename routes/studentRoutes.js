import express from "express";
import {loginStudent,
    selectHostel,
    registerStudent,
    acceptHostelID,
    acceptRoom,
    sendStudentName,
    sendHostelAllocation,
    outingPermission,
    outingDetails,
    sendOutingHistory,
    sendLoginPage,
    sendRegisterPage } from "../controller/studentController.js";

const router = express.Router();

router.get("/loginPage", sendLoginPage);

router.get("/registerPage", sendRegisterPage);

router.get("/HostelAllocation", sendHostelAllocation);

router.get("/outingPermission", outingPermission);

router.get("/selectHostel", selectHostel);

router.get("/studentName", sendStudentName);

router.get("/outingHistory", sendOutingHistory);

router.post("/loginStudent", loginStudent);

router.post("/register", registerStudent);

router.post("/acceptHostel", acceptHostelID);

router.post("/acceptRoom", acceptRoom);

router.post("/acceptOutingDetails", outingDetails);

export default router;
