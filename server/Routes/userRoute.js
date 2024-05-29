const express = require("express");
const {  register, VerifyOtp, login, loginOtpVerify,sendOtp, verifyOtp, editUser } = require("../Controllers/userController");

const router = express.Router();

router.post("/register", register);
router.post("/verify-signup-otp", VerifyOtp);
router.post("/login", login);
router.post("/verify-login", loginOtpVerify);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/update-profile/:id', editUser);

module.exports = router;
