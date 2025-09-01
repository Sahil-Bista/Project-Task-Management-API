import { UserModel } from "../models/User.js";

export const refreshTokenController = async(req , res) =>{
    try{
        const cookie = req.cookie;
        if (!cookie?.jwt) return res.status(401);
        const refreshToken = cookie.jwt;
        const foundUser = await UserModel.findOne({refreshToken});
        if(!foundUser){
            return res.status(404),json({msg:'User not found'});
        }
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err,decoded)=>{
                if(err || decoded.user != foundUser._id)
                return res.status(403)
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
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({msg:'Internal Server error'});
    }
}