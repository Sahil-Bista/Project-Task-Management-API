import { TaskModel } from "../models/Task.js";
import {ProjectModel} from "../models/Project.js"
import mongoose from "mongoose";
import { catchAsync } from "../utils/ErrorHandler.js";

export const addTaskMembership = catchAsync(async(req , res) =>{
        const userId = req.user;
        const { taskId, assignedTo } = req.body;
        const task = await TaskModel.findById(taskId);
        if(!task){
            const error = new Error('Task not found');
            error.statusCode = 400;
            throw error; 
        }
        const taskAssignees = task.assignedTo;
        const projectId = task.projectId;
        const project = await ProjectModel.findById(projectId);
        if(!project){
            const error = new Error('Project not found');
            error.statusCode = 400;
            throw error; 
        }
        const projectOwner = project.owner;
        const projectMembers = project.members;
        if(projectOwner.toString() !== userId){
            const error = new Error('Only the project owner can add members to the task');
            error.statusCode = 403;
            throw error; 
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
            const error = new Error('Only users that are a part of the project can be assigned a task in it');
            error.statusCode = 400;
            throw error; 
        }
        for (const member of validMember){
            taskAssignees.push(member);
        }
        task.taskAssignees == taskAssignees;
        await task.save()
        return res.json({msg : 'Task assigned to users', data : task, inValidMembers : inValidMembers});
});

export const removeTaskMembership = catchAsync(async(req , res) =>{
        const userId = req.user;
        const { taskId, membersToRemove } = req.body;
        const task = await TaskModel.findById(taskId);
        if(!task){
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error; 
        }
        const projectId = task.projectId;
        const project = await ProjectModel.findById(projectId);
        if(!project){
            const error = new Error('Project not found');
            error.statusCode = 404;
            throw error; 
        }
        const projectOwner = project.owner;
        const projectMembers = project.members;
        if(projectOwner.toString() !== userId){
            const error = new Error('Only the project owner can remove task members from the project');
            error.statusCode = 403;
            throw error; 
        }
        const validMembers = [];
        const invalidMembers = [];
        await Promise.all(
            membersToRemove.map((member)=>{
                const memberIds = new mongoose.Types.ObjectId(member);
                if(projectMembers.some((projectMember)=>projectMember.equals(memberIds))){
                    validMembers.push(member)
                }else{
                    invalidMembers.push(member);
                }
            })
        )
        task.assignedTo =  assignees.filter((assigne)=>!validMembers.includes(assigne.toString()));
        await task.save();
        return res.json({msg:'Members removed from task successfully', data : task, invalidMembers: invalidMembers});
});