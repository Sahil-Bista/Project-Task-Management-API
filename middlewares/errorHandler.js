//Error hangling middleware is to be defined with 4 arguments including an err argument
export const globalErrorHandler = (err, req, res, next)=>{
    console.log(err.stack);

    return res.status(err.statusCode|| 500).json({
        status : 'error',
        message : err.message || 'Something went wrong'
    })
}