export const verifyRoles = (...allowedRoles) => {
    return (req,res,next)=>{
        const userRoles = req.roles;
        if(!req.roles) return res.sendStatus(400);
        const match = userRoles.some((role) => allowedRoles.includes(role));
        if(!match){
            return res.status(401).json({msg:'User unauthorized'});
        }
        next();
    }
}