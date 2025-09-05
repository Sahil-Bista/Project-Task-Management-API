import { UserModel } from "../models/User.js";
import { catchAsync } from "../utils/ErrorHandler.js";

export const refreshTokenController = catchAsync(async(req , res) =>{
    const cookie = req.cookie;
    if (!cookie?.jwt) return res.status(401);
    const refreshToken = cookie.jwt;
    const foundUser = await UserModel.findOne({refreshToken});
    if(!foundUser){
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error; 
    }
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decoded)=>{
            if(err || decoded.user != foundUser._id){
                const error = new Error('Forbidden request');
                error.statusCode = 403;
                throw error; 
            }
            const access_token = jwt.sign(
                {
                    "UserInfo":{
                        "user" : foundUser._id,
                        "role" : foundUser.roles
                    }
                },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : '15m'}
            );
            return res.json({access_token});
        }
    );
});