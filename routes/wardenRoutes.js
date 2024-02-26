import express from "express";
import { registerWarden,
    allocateHostel,
    checkHostellers,
    outingPermissions,
    acceptHostelAllocation,
    sendStudentDetailByID,
    sendStudentDetailByRoomNo,
    outingHistory,
    updatePermission,
    loginWarden,
    loginPage} from "../controller/wardenController.js";

const router = express.Router();


// router.get("/main", wardenMain);

router.get("/allocateHostel", allocateHostel);

router.get("/checkHostllers", checkHostellers);

router.get("/outingPermissions", outingPermissions);

router.get("/outingHistory", outingHistory);

router.get("/loginPage", loginPage);

router.post("/register", registerWarden);

router.post("/loginWarden", loginWarden);

router.post("/acceptHostelAllocation", acceptHostelAllocation);

router.post("/StudentDetailsByID", sendStudentDetailByID);

router.post("/StudentDetailsByRoomNo", sendStudentDetailByRoomNo);

router.post("/updatePermission", updatePermission);

export default router;