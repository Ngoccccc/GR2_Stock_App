const express = require('express');
const {
    registerController,
    loginController,
} = require("../controllers/authController.js");

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

module.exports = router