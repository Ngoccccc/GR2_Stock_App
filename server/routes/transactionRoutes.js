const express = require('express');
const { requireSignIn } = require('../middlewares/authMiddleware.js')
const {
    getHistoryTransaction
} = require("../controllers/transactionController.js");

//router object
const router = express.Router();

router.get("/historyTransaction", requireSignIn, getHistoryTransaction);


module.exports = router