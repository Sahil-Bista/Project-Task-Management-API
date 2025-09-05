import { ProjectModel } from "../models/Project.js";
import { UserModel } from "../models/User.js";
import {TaskModel} from "../models/Task.js";
import { catchAsync } from "../utils/ErrorHandler.js";

export const addMembersToProject = catchAsync(async(req, res)=>{
        const userId = req.user;
        const {projectId} = req.params;
        const { members } = req.body;
        const foundProject = await ProjectModel.findById(projectId);
        if(!foundProject){
            const error = new Error('No such project found');
            error.statusCode = 404;
            throw error; 
        }
        const projectOwner = foundProject.owner;
        if(projectOwner.toString() !== userId){
            const error = new Error('Only the project owner can add members to the project');
            error.statusCode = 403;
            throw error; 
        }
        const projectMembers = foundProject.members;
        const invalidMembers = [];
        await Promise.all(
            members.map(async (memberId)=>{
                const user = await UserModel.findById(memberId);
                if(user){
                    if (!projectMembers.some(id => id.toString() === memberId)) {
                        projectMembers.push(memberId);
                    }
                }
                else{
                    invalidMembers.push(memberId);
                }
            })
        );
        foundProject.members = projectMembers;
        await foundProject.save();
        return res.json({msg:'Member added to the project', data: foundProject, invalidMembers : {invalidMembers}});
});

export const removeMembersFromProject = catchAsync(async(req, res)=>{
        const userId = req.user;
        const {projectId} = req.params;
        const { members } = req.body;
        const foundProject = await ProjectModel.findById(projectId);
        if(!foundProject){
            const error = new Error('Project Not Found');
            error.statusCode = 404;
            throw error; 
        }
        const tasks = await TaskModel.find({projectId});
        const projectOwner = foundProject.owner;
        if(projectOwner.toString() !== userId){
            const error = new Error('Only the project owner can remove members from the project');
            error.statusCode = 403;
            throw error; 
        }
        const projectMembers = foundProject.members;
        const validMembers = []
        const invalidMembers = [];
        await Promise.all(
            members.map(async (memberId)=>{
                const user = await UserModel.findById(memberId);
                if(user) 
                    if (projectMembers.some(id => id.toString() === memberId)) {
                        validMembers.push(memberId);
                    }
                else invalidMembers.push(memberId);
            })
        );
        for(const task of tasks){
            const taskMembers = task.assignedTo;
            task.assignedTo =  taskMembers.filter((member)=> !validMembers.includes(member.toString()));
            await task.save();
        }
        foundProject.members = projectMembers.filter((member)=> !validMembers.includes(member.toString()));
        await foundProject.save();
        return res.json({msg:'Member removed from the project', data: foundProject, invalidMembers : {invalidMembers}});
});