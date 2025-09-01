import { UserModel } from "../models/User.js";

export const logOutController = async(req , res) =>{
    const cookie = req.cookie;
    if(!cookie?.jwt) return res.sendStatus(204);
    const refreshToken = cookie.jwt;
    const foundUser = await UserModel.findOne({refreshToken});
    if(!foundUser){
        res.clearCookie("jwt", { httpOnly : true});
        return res.status(204)
    }
    foundUser.refreshToken(' ');
    foundUser.save();
    res.clearCookie("jwt",{httpOnly : true});
    return res.sendStatus(204);
}