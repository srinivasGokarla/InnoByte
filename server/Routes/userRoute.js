const express = require("express");
const {  register, VerifyOtp, login, loginOtpVerify,getUserProfile,sendUpdateOtp, verifyUpdateOtp,updateUserProfile } = require("../Controllers/userController");

const router = express.Router();

router.post("/register", register);
router.post("/verify-signup-otp", VerifyOtp);
router.post("/login", login);
router.post("/verify-login", loginOtpVerify);
router.get("/profile/:id", getUserProfile);
router.post("/profile/:id/send-otp", sendUpdateOtp);
router.put("/profile/:id", verifyUpdateOtp, updateUserProfile); 
module.exports = router;
