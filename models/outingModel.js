import mongoose  from "mongoose";

const { Schema, model } = mongoose;

const outingSchema = new Schema(
    {
        jntu_no : {
            type : String,
            required : [true, "Please add Your registration Number."],
        },
        permissionType : {
            type : String,
            required : [true, "Please elect permission Type."],
        },
        outDate : {
            type: Date,
            required : [true, "Please add the Out Date."],
        },
        outTime : {
            type : String,
            required : [true, "Please add the Out Time."],
        },
        inDate : {
            type: Date,
            required : [true, "Please add the In Date."],
        },
        inTime : {
            type : String,
            required : [true, "Please add the In Time."],
        },
        reason : {
            type : String,
            required : [true, "Please add the In Time."],            
        },
        status : {
            type : String,
        },
    },
    {
        timestamps : true,
    }
);

export default model("outingCollection", outingSchema);