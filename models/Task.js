import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true,
        default : 'To-do',
        enum : ['To-do','In-progress','Completed']
    },
    assignedTo : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    projectId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Project',
        required : true
    },
    dueDate : {
        type : Date,
        required : true
    },
    completedDate : {
        type : Date
    }
});

export const TaskModel = mongoose.model('Task', TaskSchema); 