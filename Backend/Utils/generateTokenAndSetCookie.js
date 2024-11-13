const JWT = require('jsonwebtoken')

const generateTokenAndSetCookie = async (res, userId) => {
    const token = JWT.sign({userId}, process.env.JWT_SECRET, {
        expiresIn : "7d"
    })
   res.cookie("token", token, {
        httpOnly : true, 
        secure : process.env.NODE_ENV === 'pro',
        sameSite : 'strict',
        maxAge : 7 * 24* 60 * 60 * 1000
   })
}

module.exports = {
    generateTokenAndSetCookie
};