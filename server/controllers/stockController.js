const Stock = require("../models/stockModel")

const addNewStock = async (req, res) => {
    try {
        const { companyName, symbol } = req.body
        const stock = new Stock({ companyName, symbol })
        await stock.save()
        res.json({ message: 'Add stock success ' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { addNewStock }