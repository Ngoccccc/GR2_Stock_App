const express = require('express');
const {
    addNewStock
} = require("../controllers/stockController.js");

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/add", addNewStock);

//LOGIN || POST
// router.post("/login", loginController);

module.exports = router