import { Router } from "express";
import { verifyJWT } from "../../middlewares/verifyJWT.js";
import { verifyRoles } from "../../middlewares/verifyRoles.js";
import { createProjectValidation } from "../../validators/projectValidation.js";
import { requestValidation } from "../../middlewares/validation.js";
import { createProject } from "../../controllers/projectController.js";

export const ProjectRouter = Router();

ProjectRouter.post('/create', verifyJWT, verifyRoles('User'), createProjectValidation, requestValidation, createProject);