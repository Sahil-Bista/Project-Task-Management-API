import mongoose from "mongoose";

const userSchema = new mongoose.schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    phoneNumber : {
        type : String,
        required : true
    },
    roles : {
            type : [String],
            default : ['User'],
            enum : ['User','Admin']
    },
    refreshToken : String
});

export const User = mongoose.model('User', userSchema);