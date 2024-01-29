const express = require('express');
const {
    addTodayPrice,
    searchStock,
    getTodayPrice
} = require("../controllers/marketController.js");

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.get("/getAll", getTodayPrice)
router.post("/add", addTodayPrice);
router.get("/searchStock/:keyword", searchStock);

//LOGIN || POST
// router.post("/login", loginController);

module.exports = router