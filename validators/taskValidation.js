import { body, param } from "express-validator";
import mongoose from "mongoose";

export const createTaskValidator = [
    body("name")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please enter a valid task name"),

    body("description")
        .trim()
        .escape()
        .isLength({min : 20})
        .withMessage("Task description must be at least 20 letters"),
    
    body("assignedTo")
        .optional()
        .isArray()
        .custom((assignedTo)=>{
            for (const member of assignedTo){
                if(!mongoose.Types.ObjectId.isValid(member)){
                    throw new Error (`${member} is not a valid mongoID`)
                }
            }
            return true
        }),
    
    body("projectId")
        .notEmpty()
        .isMongoId()
        .withMessage('Project Id must be a valid mongoose object'),
    
    body("dueDate")
        .isISO8601().
        withMessage("Due date must be a valid date in ISO8601 format")
        .custom((value) => {
        const inputDate = new Date(value);
        const now = new Date();
        if (inputDate <= now) {
            throw new Error("Due date must be in the future");
        }
        return true;
        }) 
]

export const deleteTaskValidator = [
    param("taskId")
        .notEmpty()
        .isMongoId()
        .withMessage('Task Id must be a valid mongo Id')
]