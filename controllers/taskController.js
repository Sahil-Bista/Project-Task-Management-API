import { ProjectModel } from "../models/Project.js";
import { TaskModel } from "../models/Task.js";

export const createTask = async(req , res)=>{
    try{
        const userId = req.user;
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

export const UpdateTaskStatus = async(req,res)=>{
    try{
        const userId = req.user;
        const {taskId, status} = req.body;
        const task = await TaskModel.findById(taskId);
        if(!task){
            return res.status(404).json({msg : 'No such task found'})
        }
        const taskAssignees = task.assignedTo;
        if(!taskAssignees.includes(userId)){
            return res.status(403).json({msg:'User unauthorized to update task status'});
        }
        task.status = status;
        await task.save()
        return res.json({msg:'Task status updated successfully', data : task})
    }catch(err){
        console.log(err);
        return res.status(500).json({msg:'Internal Server error'})
    }  
}

export const deleteTask = async(req,res) =>{
    try{
        const userId = req.user;
        const {taskId} = req.params;
        const task = await TaskModel.findById(taskId);
        if(!task){
            return res.status(404).json({msg:'No such task present'});
        }
        const projectId = task.projectId;
        const foundProject = await ProjectModel.findById(projectId);
        console.log(foundProject);
        if(!foundProject){
            return res.status(404).json({msg:'No such project available'});
        }
        const owner = foundProject.owner;
        if(owner.toString() !== userId){
            return res.status(403).json({msg:'User unauthorized to delete task from this project'});
        }
        const deletedTask = await TaskModel.findByIdAndDelete(taskId);
        return res.json({msg:'Task deleted successfully',data : deletedTask});
    }catch(err){
        console.log(err);
        return res.status(500).json({msg:'Internal Server error'})
    }  
}