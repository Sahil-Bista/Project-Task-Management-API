import { Router } from "express";
import { registerUser } from "../../controllers/registerController.js";
import { requestValidation } from "../../middlewares/validation.js";
import { registerValidator } from "../../validators/userValidation.js";

export const userRouter = Router();

userRouter.post('/register',registerValidator, requestValidation ,registerUser );