const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const sendOTPEmail = async (name, email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Verification OTP Code",
    text: `Hello ${name}, Your Verification code is ${otp}. Please do not share this with anyone.`,
  };

  await transporter.sendMail(mailOptions);
};


const sendRegistrationSuccessEmail = async (name, email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Registration Successful",
    text: `Hello ${name},\n\nYour registration was successful. Welcome to our platform!\n\nBest regards,\nTeam`,
  };

  await transporter.sendMail(mailOptions);
};



module.exports = {
  generateOTP,
  sendOTPEmail,
  sendRegistrationSuccessEmail
};
