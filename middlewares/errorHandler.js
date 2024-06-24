

// not found 

const notFound = async(req,res,next) => {
    const error = new Error(`Not Found: ${req.originalUrl}`);
    res.status(404);
    next(error);
}

const errorHandler = async(err,req,res,next) => {
    const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statuscode);
    res.json({
        message:err?.message,
        stack:err?.stack,
    });
}


module.exports = {notFound,errorHandler};