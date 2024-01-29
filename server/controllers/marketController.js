const Market = require("../models/marketModel")
const Stock = require("../models/stockModel")
const addTodayPrice = async (req, res) => {
    try {
        const { stockSymbol, price } = req.body
        const stock = await Stock.findOne({ symbol: stockSymbol })
        const today = new Date();
        const todayPrice = new Market({
            date: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())),
            stock: stock._id,
            price: price
        })
        await todayPrice.save()
        res.json({ message: 'Add price success' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getTodayPrice = async (req, res) => {
    try {
        // Lấy ngày hôm nay
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Lấy tất cả các dữ liệu từ model Market trong ngày hôm nay
        // const yesterday = new Date(today);
        // yesterday.setDate(yesterday.getDate() - 1);
        const tokensToday = await Market.find({
            date: {
                $gte: today,
                // $lte: today
            },
        }).populate('stock'); // Nếu bạn muốn lấy thông tin của stock kèm theo

        res.status(200).json({ success: true, data: tokensToday });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

const searchStock = async (req, res) => {
    try {
        const { keyword } = req.params;
        const stock = await Stock.findOne({ symbol: keyword })
        const stockMarket = await Market.find({ stock: stock._id }).sort({ date: 1 })
        res.json({ stock: stockMarket });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { addTodayPrice, searchStock, getTodayPrice }