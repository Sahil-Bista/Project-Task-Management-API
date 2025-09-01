import { ProjectModel } from "../models/Project.js";

export const createProject = async(req , res)=>{
    try{
        const userId = req.user;
        console.log(userId);
        const { name, description, members } = req.body;
        if( !name || !description){
            return res.status(400).json({msg:'Name and description required'})
        }
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