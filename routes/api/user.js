import { Router } from "express";
import { registerUser } from "../../controllers/registerController.js";
import { requestValidation } from "../../middlewares/validation.js";
import { loginValidator, registerValidator } from "../../validators/userValidation.js";
import { loginUser } from "../../controllers/authController.js";

export const userRouter = Router();

userRouter.post('/register',registerValidator, requestValidation ,registerUser);
userRouter.post('/login', loginValidator, requestValidation, loginUser);