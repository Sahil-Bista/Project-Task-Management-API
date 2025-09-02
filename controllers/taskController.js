import { ProjectModel } from "../models/Project.js";
import { TaskModel } from "../models/Task.js";

export const createTask = async(req , res)=>{
    try{
        const userId = req.userId;
        const {name,description, assignedTo, projectId, dueDate} = req.body;
        const foundProject = await ProjectModel.findById(projectId);
        if(!foundProject){
            return res.status(404).json({msg:'No such project available'});
        }
        const owner = foundProject.owner;
        if(owner.toString() !== userId){
            return res.status(403).json({msg:'User unauthorized to add task to this project'});
        }
        const projectMembers = foundProject.members;
        const validMembers = [];
        const invalidMembers = [];
        await promise.all(
            assignedTo.map((assignees)=>{
                if(projectMembers.includes(assignees)){
                    validMembers.push(assignees);
                }else{
                    invalidMembers.push(assignees);
                }
            })
        );
        const duplicate = await TaskModel.findOne({name, description, projectId});
        if(duplicate){
            return res.status(409).json({msg:'The same task already exists in the project'});
        }
        const newTask = await TaskModel.create({
            name, description,  assignedTo : validMembers, projectId, dueDate
        });
        return res.json({msg : 'Task created successfully', data : newTask, invalidMembers : invalidMembers});
    }catch(err){
        console.log(err);
        return res.status(500).json({msg:'Internal Server error'})
    }   
}