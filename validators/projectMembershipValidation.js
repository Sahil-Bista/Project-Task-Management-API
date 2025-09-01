import {body, param} from 'express-validator';
import mongoose from 'mongoose';

export const addMembersValidation = [
    body("members")
        .notEmpty()
        .isArray()
        .withMessage('Members must be an array')
        .custom((members) => {
            for (const member of members){
                if(!mongoose.Types.ObjectId.isValid(member)){
                    throw new Error(`Invalid member Id ${member}`)
                }
            }
            return true;
        }),
    
    param("projectId")
        .notEmpty()
        .isMongoId()
        .withMessage('The project Id must be a valid mongo object id')
        
]

export const removeMembersValidation = [
    body("members")
        .notEmpty()
        .isArray()
        .withMessage('Members must be an array')
        .custom((members) => {
            for (const member of members){
                if(!mongoose.Types.ObjectId.isValid(member)){
                    throw new Error(`Invalid member Id ${member}`)
                }
            }
            return true;
        }),
    
    param("projectId")
        .notEmpty()
        .isMongoId()
        .withMessage('The project Id must be a valid mongo object id')
        
]