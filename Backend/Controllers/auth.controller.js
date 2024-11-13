const User = require('../models/user.model');
const bcryptjs = require('bcryptjs');
const { generateTokenAndSetCookie } = require('../Utils/generateTokenAndSetCookie');
const { sendVerificationEmail, sendWelcomeEmail } = require('../MailTrap/emails');

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
    res.send("login route");
}


const logout = async (req,res) => {
    res.send("logout route");
}


const verifyEmail = async (req, res) => {
    const {code} = req.body;
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

module.exports = {signup, login ,logout, verifyEmail}