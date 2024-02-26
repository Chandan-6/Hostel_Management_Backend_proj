import mongoose from "mongoose";

const { Schema, model } = mongoose;

const studentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add the student name"],
    },
    jntu_no: {
      type: String,
      required: [true, "Please add the registration number"],
      unique: [true, "Registration number already found."],
    },
    year: {
      type: String,
      required: [true, "Please add your year of study."],
    },
    parent_phone_number: {
      type: String,
      required: [true, "Please add parent phone number"],
    },
    parent_email: {
      type: String,
      required: [true, "Please add parent email."],
    },
    password : {
      type : String,
      required : [true, "Please enter you password."],
    },
    hostelID : {
      type : String,
    },
    floor : {
      type : String,
    },
    room : {
      type : String,
    },
    roomType : {
      type : String,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Student", studentSchema);
