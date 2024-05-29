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
  const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  user.otp = otp;
  user.otpExpiry = otpExpiry;

  console.log('Generated OTP:', otp, 'for user:', user.email);

  await user.save();
  await sendOTPEmail(user.name, user.email, otp);
};

const verifyOTP = async (email, otp) => {
  const user = await UserModel.findOne({ email });

  console.log('Verifying OTP for email:', email, 'OTP:', otp);

  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    console.log('OTP verification failed:', { user: !!user, correctOtp: user && user.otp === otp, notExpired: user && user.otpExpiry >= Date.now() });
    throw new Error("Invalid or expired OTP");
  }

  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  console.log('OTP verified successfully for user:', email);

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

// const editUser = async (req, res) => {
//   const { id } = req.params;
//   const { name, password } = req.body;
//   const { otp } = req.body;

//   try {
//     const user = await UserModel.findById(id);
//     if (!user) {
//       return res.status(404).send({ message: "User Not Found" });
//     }

//     // Generate and send OTP if it's not already in request
//     if (!otp) {
//       await generateAndSendOTP(user);
//       return res.status(200).send({ message: "OTP sent to email" });
//     }

//     // Verify OTP
//     const verifiedUser = await verifyOTP(user.email, otp);

//     // Update user details
//     if (name) {
//       verifiedUser.name = name;
//     }
//     if (password) {
//       verifiedUser.password = await bcrypt.hash(password, 10);
//     }

//     await verifiedUser.save();

//     res
//       .status(200)
//       .send({ message: "User Updated Successfully", data: verifiedUser });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ message: "Failed to Edit data" });
//   }
// };

const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();
    await sendOTPEmail(user.name, user.email, otp);

    res.status(201).json({ message: "OTP Sent to Your email. Please Verify" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "OTP Verified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



const editUser = async (req, res) => {
  const { id } = req.params;
  const { name, password, otp } = req.body;

  console.log('Update profile request received:', { id, name, password, otp });
  console.log('Request payload:', req.body);

  try {
    const user = await UserModel.findById(id);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: "User Not Found" });
    }

    // Logging current OTP and expiry time
    console.log('Stored OTP:', user.otp);
    console.log('Stored OTP Expiry:', user.otpExpiry);
    console.log('Current Time:', Date.now());

    // Verify OTP
    if (user.otp !== otp) {
      console.log('Invalid OTP');
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpiry < Date.now()) {
      console.log('Expired OTP');
      return res.status(400).json({ message: 'Expired OTP' });
    }

    // Update user details
    if (name) {
      user.name = name;
    }
    if (password) {
      user.password = await bcrypt.hash(password, 10);
      console.log("user Password: " + user.password);
    }

    // Clear OTP fields
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    console.log('User updated successfully');
    res.status(200).json({ message: "User Updated Successfully", data: user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




module.exports = { register, VerifyOtp, login, loginOtpVerify,sendOtp, verifyOtp, editUser};
