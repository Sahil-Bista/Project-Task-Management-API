import { Router } from "express";
import { registerUser } from "../../controllers/registerController.js";
import { requestValidation } from "../../middlewares/validation.js";

export const userRouter = Router();

userRouter.get('/register', requestValidation ,registerUser );