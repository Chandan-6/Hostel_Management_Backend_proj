import express from "express";
import { registerHostel } from "../controller/hostelController.js";

const router = express.Router();

router.post("/register/hostel", registerHostel);

export default router;
