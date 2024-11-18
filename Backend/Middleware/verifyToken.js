const JWT = require('jsonwebtoken');


const verifyToken = (req,res,next) => {
    const token = req.cookies.token;
    if (!token) return res.status(400)
                .json({
                    success : false,
                    message : "Unauthorized - no token provided"
                });


    try {
        
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        
        if (!decoded) return res.status(401)
                            .json({
                                success : false,
                                message : "Unauthorized - Invalid Token"
                            });

        req.userId = decoded.userId;
        next();
    } catch (error) {
        
        console.log("Error in verifyToken", error);
        return res.status(500).json({success : false, message : "Server error"});
    }
}


module.exports = {
    verifyToken
}