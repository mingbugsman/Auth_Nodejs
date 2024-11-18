const express = require('express');
const { signup, login, logout, 
    verifyEmail, forgetPassword,
    resetPassword, checkAuth } = require('../Controllers/auth.controller');
const { verifyToken } = require('../Middleware/verifyToken');

const router = express.Router();

router.get('/check-auth', verifyToken, checkAuth);

router.post('/signup',signup )

router.post("/login", login )

router.post("/logout", logout )


router.post("/verify-email", verifyEmail);

router.post("/forgot-password", forgetPassword )

router.post("/reset-password/:token", resetPassword )
module.exports = router