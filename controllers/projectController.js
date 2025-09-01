import { ProjectModel } from "../models/Project.js";

export const createProject = async(req , res)=>{
    try{
        const userId = req.user;
        const { name, description, members } = req.body;
        const duplicate = await ProjectModel.findOne({name, description});
        if(duplicate){
            return res.status(409).json({msg:'Project with the same name and description already exists'});
        }
        const project = await ProjectModel.create({name, description, owner : userId, members});
        return res.status(200).json({msg:'New project created successfully', data : project});
    }catch(err){
        console.log(err);
        return res.status(500).json({msg:"Internal Server Error"});
    }
}

export const deleteProject = async(req , res)=>{
    try{
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
        return res.json({msg:'Project deleted successfully', data : deletedProject});
    }catch(err){
        console.log(err);
        return res.status(500).json({msg:"Internal Server Error"});
    }
}

