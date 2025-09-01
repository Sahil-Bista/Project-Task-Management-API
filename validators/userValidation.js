import { body } from "express-validator";

export const registerValidator = [
    body("email")
        .trim()
        .normalizeEmail()
        .notEmpty()
        .isEmail()
        .withMessage('Please entet a valid email'),
    
    body("password")
        .trim()
        .isLength({gt : 6})
        .withMessage('Password must be at least 7 letters'),
    
    body("firstName")
        .trim()
        .escape()
        .notEmpty()
        .withMessage('First Name is required'),
    
    body("lastName")
        .trim()
        .escape()
        .notEmpty()
        .withMessage('First Name is required'),

    body("phoneNumber")
        .trim()
        .matches(/^[0-9]{10}$/)
        .withMessage('Password must be at least 10 digits'),

    body("roles")
        .optional()
        .isArray()
        .withMessage("Roles must be an array")
        .custom((roles)=>{
            const allowedRoles = ['User','Admin']
            for (const role of roles){
                if (!allowedRoles.includes(role)){
                    throw new Error('Invalid role');
                }
            }
            return true;
        })
]

export const loginValidator = [
    body("email")
        .trim()
        .normalizeEmail()
        .notEmpty()
        .isEmail()
        .withMessage('Please enter a valid email address'),

    body("password")
        .trim()
        .isLength({gt : 6})
        .withMessage('Password must be at least 7 letters')
]