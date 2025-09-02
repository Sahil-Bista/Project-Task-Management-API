import { Router } from "express";
import { userRouter } from "./user.js";
import { ProjectRouter } from "./project.js";
import { ProjectMemberShipRouter } from "./projectMembership.js";
import { taskRouter } from "./task.js";

const router = Router();

router.get('/health', (req,res)=> res.send('OK'));
router.use('/user', userRouter );
router.use('/project', ProjectRouter);
router.use('/project/member', ProjectMemberShipRouter);
router.use('/task', taskRouter);

export default router;