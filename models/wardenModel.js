import mongoose from "mongoose";

const { Schema, model } = mongoose;

const wardenSchema = new Schema(
    {
        user_id : {
            type : String,
            required : [true, "Please Enter the user id"],
        },
        password : {
            type : String,
            required : [true, "Please Enter the Password"],
        }
    },
    {
        timestamps : true,
    }
);

export default model("wardenCollection", wardenSchema);