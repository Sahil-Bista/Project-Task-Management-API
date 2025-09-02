import { Router } from "express";
import { verifyJWT} from "../../middlewares/verifyJWT.js"
import {verifyRoles} from "../../middlewares/verifyRoles.js"
import { createTaskValidator, deleteTaskValidator, updateTaskStatusValidator } from "../../validators/taskValidation.js";
import { requestValidation } from "../../middlewares/validation.js";
import { createTask, deleteTask, UpdateTaskStatus } from "../../controllers/taskController.js";

export const taskRouter = Router();

taskRouter.post('/addTask',verifyJWT, verifyRoles('User'), createTaskValidator, requestValidation, createTask);
taskRouter.patch('/updateTaskStatus',verifyJWT, verifyRoles('User'), updateTaskStatusValidator, requestValidation, UpdateTaskStatus);
taskRouter.delete('/deleteTask/:taskId',verifyJWT, verifyRoles('User'), deleteTaskValidator, requestValidation, deleteTask);
