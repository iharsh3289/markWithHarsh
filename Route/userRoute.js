const express = require("express")
const userController = require("../controller/userController")
const auth = require('../middleware/auth')

const userrouter = express.Router();

// Route for FAQ Page
userrouter.get('/faq', (req, res) => {
  res.render('faq');
});

// Route for otp handling
userrouter.post("/sendotp", userController.sendOtp)
userrouter.get('/verifyotp', (req, res) => {
  res.render('verifyOtp', { email: req.query.email});
});
userrouter.post("/verifyotp", userController.verifyOtp)

// Route for user registration
userrouter.get('/register', (req, res) => {
  if (!req.cookies.token) {
    res.render('register');
    return ;
  }
  res.redirect('/user/account');
});
userrouter.post("/register", userController.registerUser);

// Route for user login
userrouter.get('/login', (req, res) => {
  res.render('login');
});
userrouter.post("/login", userController.loginUser);


// Route for user logout
userrouter.get('/logout', (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ success: true, messase: "Successfully Logged Out" });
});

//Route For Account Page
userrouter.get('/account', auth , (req, res) => {
  res.render('account');
});

/* Get user info */
userrouter.get('/info', auth , userController.userInfo);

/* Update existing user info */
userrouter.post("/update", auth , userController.updateUser);

/* Delete user account */
userrouter.post('/delete', auth , userController.deleteUser);

module.exports = userrouter