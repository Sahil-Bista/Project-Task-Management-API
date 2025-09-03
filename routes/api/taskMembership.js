import { Router } from "express";
import { verifyJWT } from "../../middlewares/verifyJWT.js";
import { verifyRoles } from "../../middlewares/verifyRoles.js";
import { addTaskMemberValidator, removeTaskMemberValidator } from "../../validators/taskMembershipValidation.js";
import { requestValidation } from "../../middlewares/validation.js";
import { addTaskMembership, removeTaskMembership } from "../../controllers/taskMembershipController.js";

export const TaskMembershipRouter = Router();

TaskMembershipRouter.patch('/add', verifyJWT, verifyRoles("User"), addTaskMemberValidator, requestValidation, addTaskMembership );
TaskMembershipRouter.patch('/remove', verifyJWT, verifyRoles("User"), removeTaskMemberValidator, requestValidation, removeTaskMembership );
