import { Router } from "express";
import { verifyJWT } from "../../middlewares/verifyJWT.js";
import { verifyRoles } from "../../middlewares/verifyRoles.js";
import { addMembersValidation, removeMembersValidation } from "../../validators/projectMembershipValidation.js";
import { requestValidation } from "../../middlewares/validation.js";
import { addMembersToProject, removeMembersFromProject } from "../../controllers/projectMembershipController.js";

export const ProjectMemberShipRouter = Router();

ProjectMemberShipRouter.patch('/add/:projectId', verifyJWT, verifyRoles('User'), addMembersValidation, requestValidation, addMembersToProject);
ProjectMemberShipRouter.patch('/remove/:projectId', verifyJWT, verifyRoles('User'), removeMembersValidation, requestValidation, removeMembersFromProject);
