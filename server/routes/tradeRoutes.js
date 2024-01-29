const express = require('express');
const { requireSignIn } = require('../middlewares/authMiddleware.js')
const {
    createBuyOrder,
    createSellOrder,
    getBuyOrder,
    getSellOrder,
    getMatchSellPrice,
    getMatchBuyPrice,
    deleteOrder
} = require("../controllers/tradeController.js");

//router object
const router = express.Router();

//Buy || POST
router.get("/getBuyOrder", requireSignIn, getBuyOrder);

//Sell || POST
router.get("/getSellOrder", requireSignIn, getSellOrder);

router.post("/getMatchSellPrice", getMatchSellPrice);

router.post("/getMatchBuyPrice", getMatchBuyPrice);
//routing
//Buy || POST
router.post("/buy", requireSignIn, createBuyOrder);

//Sell || POST
router.post("/sell", requireSignIn, createSellOrder);

router.delete("/deleteOrder", deleteOrder);

module.exports = router