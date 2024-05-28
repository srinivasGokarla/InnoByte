const UserModel = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const UnverifiedUserModle = require("../Models/unVerifiedUserModel");
const {
  sendOTPEmail,
  generateOTP,
  sendRegistrationSuccessEmail,
} = require("../Utils/otpUtils");
const { generateToken } = require("../Utils/tokenUtils");

const generateAndSendOTP = async (user) => {
  const otp = generateOTP();
  const otpExpiry = Date.now() + 10 * 60 * 1000;

  user.otp = otp;
  user.otpExpiry = otpExpiry;

  await user.save();
  await sendOTPEmail(user.name, user.email, otp);
};

const verifyOTP = async (email, otp) => {
  const user = await UserModel.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    throw new Error("Invalid or expired OTP");
  }

  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  return user;
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ message: "User already exists. Please log in." });
    }

    const existingUnverifiedUser = await UnverifiedUserModle.findOne({ email });
    if (existingUnverifiedUser) {
      if (existingUnverifiedUser.otpExpiry < Date.now()) {
        await UnverifiedUserModle.deleteOne({ email });
      } else {
        return res
          .status(400)
          .send({ message: "OTP already sent. Please verify your email." });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const unverifiedUser = new UnverifiedUserModle({
      name,
      email,
      password: hashedPassword,
    });
    await generateAndSendOTP(unverifiedUser);

    res.status(201).send({
      message: "OTP Sent to Your email. Please Verify",
      data: {
        name: unverifiedUser.name,
        email: unverifiedUser.email,
        id: unverifiedUser._id,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Issue" });
  }
};

const VerifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    let unverifiedUser = await UnverifiedUserModle.findOne({ email });

    if (
      !unverifiedUser ||
      unverifiedUser.otp !== otp ||
      unverifiedUser.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const user = new UserModel({
      name: unverifiedUser.name,
      email: unverifiedUser.email,
      password: unverifiedUser.password,
    });

    await user.save();
    await UnverifiedUserModle.deleteOne({ email });
    const token = generateToken(user.id);

    await sendRegistrationSuccessEmail(user.name, user.email);

    return res.status(200).send({
      message: "User Successfully Registered",
      token,
      user: {
        name: unverifiedUser.name,
        email: unverifiedUser.email,
        id: unverifiedUser._id,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Issue" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    await generateAndSendOTP(user);

    res.status(200).send({ message: "OTP sent to email" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Issue" });
  }
};
const loginOtpVerify = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await verifyOTP(email, otp);
    const token = generateToken(user.id);

    return res.status(200).send({
      message: "Login successful",
      token,
      user: { _id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id).select("-password");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Issue" });
  }
};
// Send OTP for profile update
const sendUpdateOtp = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTPEmail(user.name, user.email, otp);
    res.status(200).send({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Issue" });
  }
};
// Middleware to verify OTP
const verifyUpdateOtp = async (req, res, next) => {
  const { id } = req.params;
  const { otp } = req.body;

  try {
    const user = await UserModel.findById(id);
    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).send({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Issue" });
  }
};// Update user profile
const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { name, password } = req.body;

  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.name = name || user.name;
    user.password = password || user.password;

    const updatedUser = await user.save();
    res.status(200).send({ message: "User profile updated", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Issue" });
  }
};

module.exports = { register, VerifyOtp, login, loginOtpVerify,getUserProfile,sendUpdateOtp, verifyUpdateOtp,updateUserProfile};
