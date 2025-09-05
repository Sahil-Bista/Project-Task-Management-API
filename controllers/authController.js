import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';
import { catchAsync } from '../utils/ErrorHandler.js';

export const loginUser = catchAsync(async (req,res)=>{
    const { email, password } = req.body;
    const user = await UserModel.findOne({email});
    if(!user){
        const error = new Error('No user with this email registered in te system');
        error.statusCode = 404;
        throw error; 
    }
    const match = await bcrypt.compare(password, user.password);
    if(!match){
        const error = new Error('Incorrect password');
        error.statusCode = 401;
        throw error; 
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
});