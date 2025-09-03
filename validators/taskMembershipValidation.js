import { body } from "express-validator"
import mongoose from "mongoose"

export const addTaskMemberValidator = [
    body("taskId")
        .notEmpty()
        .isMongoId()
        .withMessage('Task Id must be a valid mongo Id'),
    
    body("assignedTo")
        .isArray({min : 1})
        .withMessage('Assigned To must be an array of userIds')
        .custom((members)=>{
            for (const member of members){
                if(!mongoose.Types.ObjectId.isValid(member)){
                    throw new Error(`Invalid member Id ${member}`);
                }
            }
            return true;
        }),
]

export const removeTaskMemberValidator = [
    body("taskId")
        .notEmpty()
        .isMongoId()
        .withMessage('Task Id must be a valid mongo Id'),
    
    body("membersToRemove")
        .isArray({min : 1})
        .withMessage('Assigned To must be an array of userIds')
        .custom((members)=>{
            for (const member of members){
                if(!mongoose.Types.ObjectId.isValid(member)){
                    throw new Error(`Invalid member Id ${member}`);
                }
            }
            return true;
        }),
]