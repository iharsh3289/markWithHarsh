// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fName: {
    type: String,
    required: true
  },
  lName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    // required: true
  },
  otpVerified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("User", userSchema);
