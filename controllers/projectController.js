import { ProjectModel } from "../models/Project.js";
import { TaskModel } from "../models/Task.js";
import { catchAsync } from "../utils/ErrorHandler.js";

export const createProject = catchAsync(async(req , res)=>{
    const userId = req.user;
    const { name, description, members } = req.body;
    const duplicate = await ProjectModel.findOne({name, description});
    if(duplicate){
        return res.status(409).json({msg:'Project with the same name and description already exists'});
    }
    const project = await ProjectModel.create({name, description, owner : userId, members});
    return res.status(200).json({msg:'New project created successfully', data : project});
});

export const getUserProject = catchAsync(async(req , res)=>{
    const userId = req.user;
    const foundProject = await ProjectModel.find({members : userId});
    if(foundProject.length === 0){
        return res.status(404).json({msg : 'No Project with you in it'});
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
        return res.status(404).json({msg : 'No such Project'});
    }
    const projectMembers = foundProject.members;
    if (!projectMembers.some(id => id.toString() === userId) && !isAdmin){
        return res.status(403).json({msg:'User unauthorized to access the project details'})
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
        return res.status(404).json({msg : 'No Such Project'});
    }
    const projectOwner = foundProject.owner;
    if (projectOwner.toString() !== userId && !isAdmin){
        return res.status(403).json({msg:'User unauthorized to update the project'})
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
        return res.status(404).json({msg : 'No Such Project'});
    }
    const projectOwner = foundProject.owner;
    if (projectOwner.toString() !== userId && !isAdmin){
        return res.status(403).json({msg:'User unauthorized to delete the project'})
    }
    const deletedProject = await ProjectModel.findByIdAndDelete(projectId);
    //works even with 0 tasks
    await TaskModel.deleteMany({projectId: projectId});
    return res.json({msg:'Project deleted successfully', data : deletedProject});
});

