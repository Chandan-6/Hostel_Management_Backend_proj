import asyncHandler from "express-async-handler";
import Hostel from "../models/hostelModel.js";


// @desc Register Hostel
// @ route POST /api/students/register/hostel
// @access public
const registerHostel = asyncHandler(async (req, res) => {
  const { hostel_name, year } = req.body;
  if (!hostel_name || !year) {
    res.status(400);
    throw new Error("All fields are mandatory.");
  }

  const hostel = await Hostel.create({
    hostel_name,
    year,
  });

  console.log(`Hostel Collection Created ${hostel}`);
  res.json({ message: "Register the student for hostel." });
});

export { registerHostel };
