import { ProjectModel } from "../models/Project.js";
import { TaskModel } from "../models/Task.js";
import { io } from '../server.js';
import { catchAsync } from "../utils/ErrorHandler.js";

export const createTask = catchAsync(async(req , res)=>{
        const userId = req.user;
        const {name,description, assignedTo, projectId, dueDate} = req.body;
        console.log(projectId);
        const foundProject = await ProjectModel.findById(projectId);
        if(!foundProject){
            const error = new Error('Project not found');
            error.statusCode = 404;
            throw error; 
        }
        const owner = foundProject.owner;
        if(owner.toString() !== userId){
            const error = new Error('User unauthoruzed to add task to this project');
            error.statusCode = 403;
            throw error; 
        }
        const projectMembers = foundProject.members;
        const validMembers = [];
        const invalidMembers = [];
        if(assignedTo && assignedTo.length >= 0){
            await Promise.all(
                assignedTo.map((assignees)=>{
                    if (projectMembers.some(member => member.toString() === assignees)){
                        validMembers.push(assignees);
                    }else{
                        invalidMembers.push(assignees);
                    }
                })
            );
        }
        const duplicate = await TaskModel.findOne({name, description, projectId});
        if(duplicate){
            const error = new Error('Task wirh the same name, description already exists for this project');
            error.statusCode = 409;
            throw error; 
        }
        const newTask = await TaskModel.create({
            name, description,  assignedTo : validMembers, projectId, dueDate
        });
        io.to(projectId).emit('taskCreated', newTask)
        return res.json({msg : 'Task created successfully', data : newTask, invalidMembers : invalidMembers});
});

export const getTaskDetails = catchAsync(async(req,res)=>{
        const userId = req.user;
        const {taskId} = req.params;
        const task = await TaskModel.findById(taskId);
        if(!task){
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error; 
        }
        const projectId = task.projectId;
        const project  = await ProjectModel.findById(projectId);
        if(!project){
            const error = new Error('Project not found');
            error.statusCode = 404;
            throw error; 
        }
        const projectOwner = project.owner;
        const taskAssignees = task.assignedTo;
        if(projectOwner.toString() !== userId && !taskAssignees.includes(userId)){
            const error = new Error('User unauthorized to get task details');
            error.statusCode = 403;
            throw error; 
        }
        return res.json({msg:'Task details retirieved successfully', data : task});  
});

export const getProjectSpecificTasks = catchAsync(async(req,res)=>{
        const userId = req.user;
        const {projectId} = req.params;
        const project = await ProjectModel.findById(projectId);
        if(!project){
            const error = new Error('Project not found');
            error.statusCode = 404;
            throw error; 
        } 
        const projectMembers = project.members;
        if(!projectMembers.includes(userId)){
            const error = new Error('User unauthorized to get task list for the project');
            error.statusCode = 403;
            throw error; 
        }
        const task = await TaskModel.find({projectId});
        if(!task){
            return res.status(204).json({msg:'No tasks have been created within this project'})
        }
        return res.json({msg:'Task list retrieved', data : task});
});

export const UpadateTaskDetails = catchAsync(async(req,res)=>{
        const userId = req.user;
        const {taskId, name, description, status, dueDate} = req.body;
        const task = await TaskModel.findById(taskId);
        if(!task){
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error; 
        }
        const projectId = task.projectId;
        const project  = await ProjectModel.findById(projectId);
        if(!project){
            const error = new Error('Project not found');
            error.statusCode = 404;
            throw error; 
        }
        const projectOwner = project.owner;
        if(projectOwner.toString() !== userId){
            const error = new Error('Task description can only be updated by the project owner');
            error.statusCode = 403;
            throw error; 
        }
        const newTask = {};
        if (name) newTask.name = name;
        if(description) newTask.description = description;
        if(status) newTask.status = status;
        if(dueDate) newTask.dueDate = dueDate;
        const updatedTask = await TaskModel.findByIdAndUpdate(
            taskId,
            //$set tells to update only these fields leaving the remaining fields untouched
            {$set: newTask },
            { new: true, runValidators: true } 
        );
        return res.json({ msg: 'Task updated successfully', data: updatedTask });
});

export const UpdateTaskStatus = catchAsync(async(req,res)=>{
        const userId = req.user;
        const {taskId, status} = req.body;
        const task = await TaskModel.findById(taskId);
        if(!task){
            const error = new Error('Task not found');
            error.statusCode = 404;
            throw error; 
        }
        const taskAssignees = task.assignedTo;
        const projectId = task.projectId;
        const project  = await ProjectModel.findById(projectId);
        if(!project){
            const error = new Error('Project not found');
            error.statusCode = 404;
            throw error; 
        }
        const projectOwner = project.owner;
        if(projectOwner.toString() !== userId && !taskAssignees.includes(userId)){
            const error = new Error('User unauthorized to get tas details');
            error.statusCode = 403;
            throw error; 
        }
        task.status = status;
        await task.save()
        io.to(projectId.toString()).emit('taskStatusUpdate',{name : task.name, status : task.status})
        return res.json({msg:'Task status updated successfully', data : task})
});

export const deleteTask = catchAsync(async(req,res) =>{
        const userId = req.user;
        const {taskId} = req.params;
        const task = await TaskModel.findById(taskId);
        if(!task){
            const error = new Error('No such task found');
            error.statusCode = 404;
            throw error; 
        }
        const projectId = task.projectId;
        const foundProject = await ProjectModel.findById(projectId);
        if(!foundProject){
            const error = new Error('Project not found');
            error.statusCode = 404;
            throw error; 
        }
        const owner = foundProject.owner;
        if(owner.toString() !== userId){
            const error = new Error('Only the project owner can delete tasks from the project');
            error.statusCode = 403;
            throw error; 
        }
        const deletedTask = await TaskModel.findByIdAndDelete(taskId);
        io.to(projectId.toString()).emit('taskDeletion', deletedTask);
        return res.json({msg:'Task deleted successfully',data : deletedTask});
});