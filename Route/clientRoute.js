const express = require("express")
const clientController = require("../controller/userController")

const clientrouter = express.Router();

// Route for Home Page
clientrouter.get('/', (req, res) => {
  res.render('home');
});








module.exports = clientrouter