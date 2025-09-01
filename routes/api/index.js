import { Router } from "express";
import { userRouter } from "./user.js";
import { ProjectRouter } from "./project.js";

const router = Router();

router.get('/health', (req,res)=> res.send('OK'));
router.use('/user', userRouter );
router.use('/project', ProjectRouter);

export default router;