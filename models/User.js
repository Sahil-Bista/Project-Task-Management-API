import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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

export const UserModel = mongoose.model('User', userSchema);