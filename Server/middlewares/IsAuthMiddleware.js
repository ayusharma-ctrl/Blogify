// func to check whether the user is authorized or not to access the information
export const isUserAuthenticated = (req,res,next) => {
    if(req.session.isAuth){
        next();
    }else{
        return res.status(400).json({
            success: false,
            message: "Invalid session! Please login again."
        })
    }
}