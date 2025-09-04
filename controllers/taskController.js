import { ProjectModel } from "../models/Project.js";
import { TaskModel } from "../models/Task.js";

export const createTask = async(req , res)=>{
    try{
        const userId = req.user;
        const {name,description, assignedTo, projectId, dueDate} = req.body;
        console.log(projectId);
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

export const getTaskDetails = async(req,res)=>{
    try{
        const userId = req.user;
        const {taskId} = req.params;
        const task = await TaskModel.findById(taskId);
        if(!task){
            return res.status(404).json({msg : 'No such task found'})
        }
        const projectId = task.projectId;
        const project  = await ProjectModel.findById(projectId);
        if(!project){
            return res.status(404).json({msg:'No such project available'});
        }
        const projectOwner = project.owner;
        const taskAssignees = task.assignedTo;
        if(projectOwner.toString() !== userId && !taskAssignees.includes(userId)){
            return res.status(403).json({msg:'User unauthorized to get task details'});
        }
        return res.json({msg:'Task details retirieved successfully', data : task});
    }catch(err){
        console.log(err);
        return res.status(500).json({msg:'Internal Server error'})
    }  
}

export const getProjectSpecificTasks = async(req,res)=>{
    try{
        const userId = req.user;
        const {projectId} = req.params;
        const project = await ProjectModel.findById(projectId);
        if(!project){
            return res.status(404).json({msg : 'No such project found'});
        } 
        const projectMembers = project.members;
        if(!projectMembers.includes(userId)){
            return res.status(403).json({msg:'User unauthorized to get task list for the project'});
        }
        const task = await TaskModel.find({projectId});
        if(!task){
            return res.status(204).json({msg:'No tasks have been created within this project'})
        }
        return res.json({msg:'Task list retrieved', data : task});
    }catch(err){
        console.log(err);
        return res.status(500).json({msg:'Internal Server error'})
    } 
}

export const UpadateTaskDetails = async(req,res)=>{
    try{
        const userId = req.user;
        const {taskId, name, description, status, dueDate} = req.body;
        const task = await TaskModel.findById(taskId);
        if(!task){
            return res.status(404).json({msg : 'No such task found'})
        }
        const projectId = task.projectId;
        const project  = await ProjectModel.findById(projectId);
        if(!project){
            return res.status(404).json({msg:'No such project available'});
        }
        const projectOwner = project.owner;
        if(projectOwner.toString() !== userId){
            return res.status(403).json({msg:'User unauthorized to update task description'});
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
        const projectId = task.projectId;
        const project  = await ProjectModel.findById(projectId);
        if(!project){
            return res.status(404).json({msg:'No such project available'});
        }
        const projectOwner = project.owner;
        if(projectOwner.toString() !== userId && !taskAssignees.includes(userId)){
            return res.status(403).json({msg:'User unauthorized to get task details'});
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