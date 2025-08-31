import { UserModel } from "../models/User.js";

export const registerUser = async(req , res) =>{
    try{
        const {email ,password ,firstName ,lastName ,phoneNumber} = req.body;
        if(!email || !password || !firstName || !lastName || !phoneNumber){
            return res.status(400).json({msg:"All fields required"});
        }
        const duplicate = await UserModel.findOne({email});
        if(duplicate){
            return res.status(409).json({msg:'A user with the same email already exists'});
        }
        const newUser = await UserModel.create({ email, password, firstName, lastName, phoneNumber});
        return res.json({msg:'New user regsitered successfully', data: newUser});
    }catch(err){
        console.error(err);
        return res.status(500).json({msg : 'Internal Server error, please try again'})
    }
}