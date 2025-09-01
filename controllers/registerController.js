import { UserModel } from "../models/User.js";
import bcrypt from 'bcrypt';

export const registerUser = async(req , res) =>{
    try{
        const {email ,password ,firstName ,lastName ,phoneNumber, roles} = req.body;
        const duplicate = await UserModel.findOne({email});
        if(duplicate){
            return res.status(409).json({msg:'A user with the same email already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({ email, password:hashedPassword, firstName, lastName, phoneNumber, roles});
        return res.json({msg:'New user regsitered successfully', data: newUser});
    }catch(err){
        console.error(err);
        return res.status(500).json({msg : 'Internal Server error, please try again'})
    }
}