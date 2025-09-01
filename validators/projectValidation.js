import { body } from "express-validator";
import mongoose from "mongoose";

export const createProjectValidation = [
    body("name")
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Project Name is required'),
    
    body("description")
        .trim()
        .escape()
        .isLength({gt : 20})
        .withMessage('Project Descrtiption should at least be 20 letters long'),
        
    body("members")
        .optional()
        .isArray()
        .withMessage('Members must be an array')
        .custom((members)=>{
            for (const member of members){
                if(!mongoose.Types.ObjectId.isValid(member)){
                    throw new Error(`Invalid member Id ${member}`);
                }
            }
            return true;
        }),
]