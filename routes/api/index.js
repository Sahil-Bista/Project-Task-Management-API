import { Router } from "express";
import { userRouter } from "./user.js";
import { verifyJWT } from "../../middlewares/verifyJWT.js";
import {verifyRoles} from "../../middlewares/verifyRoles.js"

const router = Router();

router.get('/health', verifyJWT, verifyRoles('User'), (req,res)=> res.send('OK'));
router.use('/user', userRouter );

export default router;