const HistoryTransaction = require("../models/historyTransactionModel")

const getHistoryTransaction = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log(userId);
        const historyTransaction = await HistoryTransaction.find({ userId: userId }).populate("stock")
        res.json(historyTransaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getHistoryTransaction }
