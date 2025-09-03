import { Router } from "express";
import { verifyJWT} from "../../middlewares/verifyJWT.js"
import {verifyRoles} from "../../middlewares/verifyRoles.js"
import { createTaskValidator, deleteTaskValidator, getTaskListValidator, getTaskValidator, updateTaskStatusValidator, updateTaskValidator } from "../../validators/taskValidation.js";
import { requestValidation } from "../../middlewares/validation.js";
import { createTask, deleteTask, getProjectSpecificTasks, getTaskDetails, UpadateTaskDetails, UpdateTaskStatus } from "../../controllers/taskController.js";

export const taskRouter = Router();

taskRouter.post('/addTask',verifyJWT, verifyRoles('User'), createTaskValidator, requestValidation, createTask);
taskRouter.get('/:taskId',verifyJWT, verifyRoles('User'), getTaskValidator, requestValidation, getTaskDetails);
taskRouter.get('/project/:projectId',verifyJWT, verifyRoles('User'), getTaskListValidator, requestValidation, getProjectSpecificTasks);
taskRouter.patch('/updateTaskStatus',verifyJWT, verifyRoles('User'), updateTaskStatusValidator, requestValidation, UpdateTaskStatus);
taskRouter.patch('/updateTask',verifyJWT, verifyRoles('User'), updateTaskValidator, requestValidation, UpadateTaskDetails);
taskRouter.delete('/deleteTask/:taskId',verifyJWT, verifyRoles('User'), deleteTaskValidator, requestValidation, deleteTask);

