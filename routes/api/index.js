import { Router } from "express";
import { userRouter } from "./user.js";

const router = Router();

router.get('/health', (req,res)=> res.send('OK'));
router.use('/user', userRouter );

export default router;