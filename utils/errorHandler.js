//we actually need a function inside
//because promises are returned only after function calls
export const catchAsync = fn => (req,res,next)=>{
    fn(req,res,next).catch(next);
}