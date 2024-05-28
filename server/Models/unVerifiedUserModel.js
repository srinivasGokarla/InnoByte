const { Schema, model } = require("mongoose");

const UnverifiedUserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  otpExpiry: { type: Date, required: true },
});

const UnverifiedUserModle = model("UnverifiedUser", UnverifiedUserSchema);

module.exports = UnverifiedUserModle;
