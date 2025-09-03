import { Router } from "express";
import { verifyJWT } from "../../middlewares/verifyJWT.js";
import { verifyRoles } from "../../middlewares/verifyRoles.js";
import { addTaskMemberValidator } from "../../validators/taskMembershipValidation.js";
import { requestValidation } from "../../middlewares/validation.js";
import { addTaskMembership } from "../../controllers/taskMembershipController.js";

export const TaskMembershipRouter = Router();

TaskMembershipRouter.post('/add', verifyJWT, verifyRoles("User"), addTaskMemberValidator, requestValidation, addTaskMembership );