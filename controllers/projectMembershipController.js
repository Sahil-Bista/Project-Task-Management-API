import { ProjectModel } from "../models/Project.js";
import { UserModel } from "../models/User.js";

export const addMembersToProject = async(req, res)=>{
    try{
        const userId = req.user;
        const {projectId} = req.params;
        const { members } = req.body;
        const foundProject = await ProjectModel.findById(projectId);
        if(!foundProject){
            return res.status(404).json({msg:'No such project found'});
        }
        const projectOwner = foundProject.owner;
        if(projectOwner.toString() !== userId){
            return res.status(403).json({msg:'User unauthorized to add members to the project'});
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
    }catch(err){
        console.log(err);
        return res.status(500).json({msg:'Internal Server error'});
    }
}

export const removeMembersFromProject = async(req, res)=>{
    try{
        const userId = req.user;
        const {projectId} = req.params;
        const { members } = req.body;
        const foundProject = await ProjectModel.findById(projectId);
        if(!foundProject){
            return res.status(404).json({msg:'No such project found'});
        }
        const projectOwner = foundProject.owner;
        if(projectOwner.toString() !== userId){
            return res.status(403).json({msg:'User unauthorized to add members to the project'});
        }
        const projectMembers = foundProject.members;
        const validMembers = []
        const invalidMembers = [];
        await Promise.all(
            members.map(async (memberId)=>{
                const user = await UserModel.findById(memberId);
                if(user) 
                    if(user){
                    if (!projectMembers.some(id => id.toString() === memberId)) {
                        validMembers.push(memberId);
                    }
                }
                else invalidMembers.push(memberId);
            })
        );
        foundProject.members = projectMembers.filter((member)=> !validMembers.includes(member.toString()));
        await foundProject.save();
        return res.json({msg:'Member removed from the project', data: foundProject, invalidMembers : {invalidMembers}});
    }catch(err){
        console.log(err);
        return res.status(500).json({msg:'Internal Server error'});
    }
}