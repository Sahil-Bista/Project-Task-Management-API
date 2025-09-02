import { Router } from "express";
import { verifyJWT} from "../../middlewares/verifyJWT.js"
import {verifyRoles} from "../../middlewares/verifyRoles.js"
import { createTaskValidator } from "../../validators/taskValidation.js";
import { requestValidation } from "../../middlewares/validation.js";
import { createTask } from "../../controllers/taskController.js";

export const taskRouter = Router();

taskRouter.post('/addTask',verifyJWT, verifyRoles('User'), createTaskValidator, requestValidation, createTask);