import jwt from 'jsonwebtoken';

export const verifyJWT = async(req , res, next)=>{
    const authorization = req.headers.authorization || req.headers.Authorization;
    if(!authorization?.startsWith('Bearer ')) return res.status(401).json({msg:'Invalid token'});
    const token = authorization.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err,decoded) => {
            if(err) return res.sendStatus(401);
            req.user = decoded.userInfo.user;
            req.roles = decoded.userInfo.role;
            next();
    })
}