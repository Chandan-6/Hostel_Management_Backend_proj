import mongoose from "mongoose";

const { Schema, model } = mongoose;

const hostelSchema = new Schema(
  {
    hostel_name: {
      type: String,
      required: [true, "Please add the registration number"],
    },
    year: {
      type: String,
      required: [true, "Please add your year of study."],
    },
  },
  {
    timestamps: true,
  }
);

export default model("HostelCollection", hostelSchema);
