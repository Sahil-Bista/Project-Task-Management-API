import { Router } from "express";
import { verifyJWT } from "../../middlewares/verifyJWT.js";
import { verifyRoles } from "../../middlewares/verifyRoles.js";
import { addMembersValidation } from "../../validators/projectMembershipValidation.js";
import { requestValidation } from "../../middlewares/validation.js";
import { addMembersToProject } from "../../controllers/projectMembershipController.js";

export const ProjectMemberShipRouter = Router();

ProjectMemberShipRouter.patch('/add/:projectId', verifyJWT, verifyRoles('User'), addMembersValidation, requestValidation, addMembersToProject);