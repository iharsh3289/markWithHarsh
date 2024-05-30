const otpgen = require("otp-generator")
require("dotenv").config()
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const sendmail = require('../utils/sendmail')
const bcrypt = require('bcryptjs');


const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);

    const otpgenerated = otpgen.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

    await sendmail(email,otpgenerated);
    await User.findOneAndUpdate({ email }, { otp: otpgenerated }, { new: true, upsert: true });
    return res.status(200).json({
      success: true,
      message: `OTP sent to ${email}`
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: error.message
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, enteredOtp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found with this email"
      });
    }

    if (user.otp !== enteredOtp) {
      return res.status(400).json({
        status: false,
        message: "Entered OTP is incorrect"
      });
    }

    // Update user's otpVerified status
    await User.updateOne({ email }, { otpVerified: true });

    return res.status(200).json({
      success: true,
      message: "OTP verification successfully done"
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};


const registerUser = async (req, res) => {
  try {
    var { fName, lName, email, password, phoneNumber } = req.body;
    const existingUseremail = await User.findOne({ email });

    if (existingUseremail) {
      return res.status(400).json({ message: "Email already registered" });
    }


    password = await bcrypt.hash(password, 8);

    // Update existing user if found, otherwise create new user
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { fName, lName, email, password, phoneNumber },
      { new: true, upsert: true }
    );

    return res.status(200).json({ success: true, message: "User registered successfully", user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordIsValid = bcrypt.compareSync(
      password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    if(!user.otpVerified){
      return res.status(400).json({ status:"registeragain" ,message:"OTP Not Verified" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.tokenpass, { expiresIn: "6h" });

    return res.cookie('token', token, { httOnly: true }).status(200).json({ success: true, message: "Login Success", userDetails: user, token: token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res)=>{
  const decoded = jwt.verify(req.cookies.token, process.env.tokenpass);

  const userToUpdate = await User.findOne({ _id: decoded.userId });
  const existingemail = await User.findOne({ email: req.body.email });

  if(existingemail){
    return res
      .status(300)
      .json({
        "message": "Email Already Exists",
        "success": false
      });
  }
  if (userToUpdate) {
    if (typeof req.body.fName !== 'undefined'
      && req.body.fName !== null && req.body.fName.length) {
      userToUpdate.fName = req.body.fName;
    } if (typeof req.body.lName !== 'undefined'
      && req.body.lName !== null && req.body.lName.length) {
      userToUpdate.lName = req.body.lName;
    } if (typeof req.body.email !== 'undefined'
      && req.body.email !== null && req.body.email.length) {
      userToUpdate.email = req.body.email;
    } if (typeof req.body.password !== 'undefined'
      && req.body.password !== null && req.body.password.length) {
      userToUpdate.password = req.body.password
    }
    await userToUpdate.save()

    res
      .status(200)
      .json({
        "success": true,
        "message": "user Updated",
        "data": {
          "fName": userToUpdate.fName,
          "lName": userToUpdate.lName,
          "email": userToUpdate.email,
          "phoneNumber": userToUpdate.phoneNumber
        },
      });
  }
  else {
    res
      .status(400)
      .json({
        "message": "User Not Found",
        "data": err,
        "success": false
      });
  }

};

const deleteUser = async (req, res)=>{
  const decoded = jwt.verify(req.cookies.token, process.env.tokenpass);

  const user = await User.remove({ _id: decoded.userId });
  if (user) {
    req.session.destroy();
    res
      .status(200)
      .json({
        "message": "User removed",
        "data": {},
        "success": true
      });
  }
  else {
    console.log(err);
    req
      .status(500)
      .json({
        "message": "Server error: could not delete user",
        "data": err,
        "success": false
      });
  }
};

const userInfo = async(req,res) => {
  const decoded = jwt.verify(req.cookies.token, process.env.tokenpass);

  const user = await User.findOne({ _id: decoded.userId });
  if (user) {
    return res
      .status(200)
      .json({
        "message": "Search completed successfully",
        "data": (user ? user : {}),
        "success": true
      });
  }
  else {
    console.log(err);
    return res
      .status(500)
      .json({
        "message": "Server error - could not complete your request",
        "data": err,
        "success": false
      });
  }
};

module.exports = { sendOtp, verifyOtp, registerUser, loginUser, updateUser, deleteUser, userInfo }