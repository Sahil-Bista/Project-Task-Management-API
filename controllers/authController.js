import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';

export const loginUser = async (req,res)=>{
    try{
        const { email, password } = req.body;
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(404).json({msg:'No such user in the system, Please register before logging in'})
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(401).json({msg:'Incorrect password'});
        }
        const access_token = jwt.sign(
            {
                "UserInfo":{
                    "user" : user._id,
                    "role" : user.roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : '15m'}
        );
        const refresh_token = jwt.sign(
            {
                "user" : user._id
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : '15d'}
        );
        user.refreshToken = refresh_token;
        await user.save();
        res.cookie('jwt', refresh_token, {httpOnly : true, maxAge : 24*60*60*1000});
        return res.json({access_token});
    }catch(err){
        console.log(err);
        return res.status(500).json({msg : 'Internal Server error'});
    }
}