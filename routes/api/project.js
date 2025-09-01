import { Router } from "express";
import { verifyJWT } from "../../middlewares/verifyJWT.js";
import { verifyRoles } from "../../middlewares/verifyRoles.js";
import { createProjectValidation, getProjectValidaiton, updateProjectValidation } from "../../validators/projectValidation.js";
import { requestValidation } from "../../middlewares/validation.js";
import { createProject, deleteProject, getProjectDetails, getUserProject, updateProjectDetails } from "../../controllers/projectController.js";

export const ProjectRouter = Router();

ProjectRouter.post('/create', verifyJWT, verifyRoles('User'), createProjectValidation, requestValidation, createProject);
ProjectRouter.get('/', verifyJWT, verifyRoles('User'), getUserProject);
ProjectRouter.get('/:projectId', verifyJWT, verifyRoles('User', 'Admin'), getProjectValidaiton, requestValidation, getProjectDetails);
ProjectRouter.patch('/:projectId', verifyJWT, verifyRoles('User', 'Admin'), updateProjectValidation, requestValidation, updateProjectDetails);
ProjectRouter.delete('/delete/:projectId', verifyJWT, verifyRoles('User', 'Admin'), createProjectValidation, requestValidation, deleteProject);

