const User = require('../models/user.model');
const bcryptjs = require('bcryptjs');
const { generateTokenAndSetCookie } = require('../Utils/generateTokenAndSetCookie');
const { sendVerificationEmail, sendWelcomeEmail
    ,sendPasswordResetEmail, sendResetSuccessEmail
 } = require('../MailTrap/emails');
const crypto = require('crypto');

const signup = async (req,res) => {

    const {email , password, name} = req.body;
    try {
        if (!email || !password || !name) {
            throw new Error('all fields are required');
        }
      
        const userAlreadyExits = await User.findOne({email});
        if (userAlreadyExits) {
            return res.status(400).json({success : false, message : "User already exists"});
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random()*900000).toString();
        const user = new User({
            email,
            password : hashedPassword, 
            name,
            verificationToken,
            verificationTokenExpiresAt : Date.now() + 24 * 10 * 60 * 1000

        })
        await user.save();
        //jwt
        await generateTokenAndSetCookie(res, user._id );

        await sendVerificationEmail(user.email, verificationToken);
        res.status(201).json({
            success : true,
            message : "User created successfully",
            user : {
                ...user._doc, 
                password : undefined
            }
        })
    } catch (error) {
        res.status(400).json({success: false, message : error.message})
    }
}

const login =  async (req,res) => {
    const {email ,password} = req.body;
    try {
        const user = await User.findOne({email});

        if (!user) {
            return res.status(400)
            .json({success : false, message : "Invalid credentials"});
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400)
            .json({success : false, message : "wrong password"});
        }

        await generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success : true,
            message : "Logged in successfully",
            user : {
                ...user._doc,
                password : undefined
            }
        })
    } catch (error) {
        console.log("Error in login", Error);
        res.status(400).json({success : false, message : error.message});
    }
}


const  logout = async (req,res) => {
    res.clearCookie("token");
    res.status(200).json({success : true, 
        message : "Logged out successfully"})
}


const verifyEmail = async (req, res) => {
  
    const code = req.body.verificationCode;
    try {
        const user = await User.findOne({
            verificationToken : code,
            verificationTokenExpiresAt : {$gt : Date.now()}
        });

        if (!user) {
            return res.status(400).json({success: false, message
                : "Invalid or expired verification code"
            })
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name );

        res.status(200).json({
            success : true,
            message : "Email verified successfully",
            user : {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        
    }
}

const forgetPassword = async (req, res) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({email});
        
        if (!user) {
            return res.status(400).json({ success : false, message : "User not found"});
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hours;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        
        res.status(200).json({
            success : true,
            message : "Password reset link sent to your email"
        });
    } catch (error) {
        console.log("Error in forgotPassword", error);
        res.status(400).json({success : false, message : error.message});
    }
}

const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;
        
        const user = await User.findOne({
            resetPasswordToken : token,
            resetPasswordExpiresAt : {$gt : Date.now()},

        })

        if (!user) {
            return res.status(400).json({success: false, message : 
                "Invalid or expired reset token"
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({success : true, message : "Password reset successfully"});
    } catch (error) {
        console.log("Error in reset Password", error);
        res.status(400).json({success : false, message : error.message});
    }
}

const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
                    .select("-password");
         
        
        if (!user) return res.status(400).json({success : false, 
            message : "User not found"
        });

        return res.status(200).json({success : true, user});
        

    } catch (error) {
        console.log("Error in checkAuth", error);
        res.status(400).json({
            success : false,
            message : error.message
        })
    }
}

module.exports = {
    signup, login ,logout, 
    verifyEmail, forgetPassword, resetPassword,
    checkAuth
}