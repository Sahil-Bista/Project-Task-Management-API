import { TaskModel } from "../models/Task.js";
import {ProjectModel} from "../models/Project.js"
import mongoose from "mongoose";

export const addTaskMembership = async(req , res) =>{
    try{
        const userId = req.user;
        const { taskId, assignedTo } = req.body;
        const task = await TaskModel.findById(taskId);
        if(!task){
            return res.status(400).json({msg:'No such task found, please enter a valid task Id'});
        }
        const taskAssignees = task.assignedTo;
        const projectId = task.projectId;
        const project = await ProjectModel.findById(projectId);
        if(!project){
            return res.status(400).json({msg:'No such project found'});
        }
        const projectOwner = project.owner;
        const projectMembers = project.members;
        if(projectOwner.toString() !== userId){
            return res.status(403).json({msg:'User unauthorized to add members to the task'});
        }
        const validMember = [];
        const inValidMembers = [];
        await Promise.all(
            assignedTo.map(async (assignee)=>{
                const assigneeId = new mongoose.Types.ObjectId(assignee);
                if(projectMembers.some(members=> members.equals(assigneeId))){
                    validMember.push(assignee);
                }else{
                    inValidMembers.push(assignee);
                }
            })
        )
        if(validMember.length === 0){
            return res.status(400).json({msg:'PLease enter users that are a part of the project to aasign the task to'})
        }
        for (const member of validMember){
            taskAssignees.push(member);
        }
        task.taskAssignees == taskAssignees;
        await task.save()
        return res.json({msg : 'Task assigned to users', data : task, inValidMembers : inValidMembers});
    }catch(err){
        console.error(err);
        return res.status(500).json({msg:'Internal Server Error'});
    }
}

export const removeTaskMembership = async(req , res) =>{
    try{

    }catch(err){
        console.error(err);
        return res.status(500).json({msg:'Internal Server Error'});
    }
}