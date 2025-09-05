import { ProjectModel } from "../models/Project.js";
import { TaskModel } from "../models/Task.js";
import { catchAsync } from "../utils/ErrorHandler.js";

export const createProject = catchAsync(async(req , res)=>{
    const userId = req.user;
    const { name, description, members } = req.body;
    const duplicate = await ProjectModel.findOne({name, description});
    if(duplicate){
        const error = new Error('Project with the same name and description already exists');
        error.statusCode = 409;
        throw error; 
    }
    const project = await ProjectModel.create({name, description, owner : userId, members});
    return res.status(200).json({msg:'New project created successfully', data : project});
});

export const getUserProject = catchAsync(async(req , res)=>{
    const userId = req.user;
    const foundProject = await ProjectModel.find({members : userId});
    if(foundProject.length === 0){
        const error = new Error('No project found for the user');
        error.statusCode = 404;
        throw error; 
    }
    return res.json({msg:'Project retrieved successfully', data : foundProject});
});

export const getProjectDetails = catchAsync(async(req , res)=>{
    const userId = req.user;
    const userRoles = req.roles;
    const isAdmin = userRoles.includes('Admin');
    const { projectId } = req.params;
    const foundProject = await ProjectModel.findById(projectId);
    if(!foundProject){
        const error = new Error('Project Not found');
        error.statusCode = 404;
        throw error; 
    }
    const projectMembers = foundProject.members;
    if (!projectMembers.some(id => id.toString() === userId) && !isAdmin){
        const error = new Error('User unauthorized to access project details');
        error.statusCode = 403;
        throw error; 
    }
    return res.json({msg:'Project retrieved successfully', data : foundProject});
});

export const updateProjectDetails = catchAsync(async(req, res)=>{
    const userId = req.user;
    const userRole = req.roles;
    const isAdmin = userRole.includes('Admin');
    const {projectId} = req.params;
    const { name, description } = req.body;
    const foundProject = await ProjectModel.findById(projectId);
    if(!foundProject){
        const error = new Error('No such project found');
        error.statusCode = 404;
        throw error; 
    }
    const projectOwner = foundProject.owner;
    if (projectOwner.toString() !== userId && !isAdmin){
        const error = new Error('User unauthorized to update the project');
        error.statusCode = 403;
        throw error; 
    }
    foundProject.name = name;
    foundProject.description = description;
    await foundProject.save();
    return res.json({msg:'Project updated successfully', data : foundProject});
});

export const deleteProject = catchAsync(async(req , res)=>{
    const userId = req.user;
    const userRole = req.roles;
    const isAdmin = userRole.includes('Admin');
    const {projectId} = req.params;
    const foundProject = await ProjectModel.findById(projectId);
    if(!foundProject){
        const error = new Error('Project Not Found');
        error.statusCode = 404;
        throw error; 
    }
    const projectOwner = foundProject.owner;
    if (projectOwner.toString() !== userId && !isAdmin){
        const error = new Error('User unauthorized to delete the project');
        error.statusCode = 403;
        throw error; 
    }
    const deletedProject = await ProjectModel.findByIdAndDelete(projectId);
    //works even with 0 tasks
    await TaskModel.deleteMany({projectId: projectId});
    return res.json({msg:'Project deleted successfully', data : deletedProject});
});

