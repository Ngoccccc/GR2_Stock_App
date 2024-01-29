const BuyOrder = require("../models/buyOrderModel")
const SellOrder = require("../models/sellOrderModel")
const User = require("../models/userModel")
const Stock = require("../models/stockModel")
const Market = require("../models/marketModel")
const { matchOrders } = require("./matchOrderController")

const getBuyOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const buyOrder = await BuyOrder.find({ userId: userId }).sort({ createdAt: -1 }).populate("stock")
        return res.status(200).json(buyOrder);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getSellOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const buyOrder = await SellOrder.find({ userId: userId }).sort({ createdAt: -1 }).populate("stock")
        return res.status(200).json(buyOrder);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getMatchSellPrice = async (req, res) => {
    try {
        const { stockSymbol } = req.body
        console.log(req.body);
        const stock = await Stock.findOne({ symbol: stockSymbol })
        const buyOrders = await BuyOrder.find({ stock: stock._id }).sort({ price: -1, createdAt: 1 });
        return res.status(200).json(buyOrders.length !== 0 && buyOrders ? buyOrders[0].price : -1);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getMatchBuyPrice = async (req, res) => {
    try {
        const { stockSymbol } = req.body
        console.log(req.body);
        const stock = await Stock.findOne({ symbol: stockSymbol })
        const sellOrders = await SellOrder.find({ stock: stock._id }).sort({ price: 1, createdAt: 1 });
        return res.status(200).json(sellOrders.length !== 0 && sellOrders ? sellOrders[0].price : -1);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const createBuyOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { quantity, stockSymbol, price } = req.body
        const stock = await Stock.findOne({ symbol: stockSymbol })
        const today = new Date();
        const dateOnly = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))
        const todayPrice = await Market.findOne({ date: dateOnly, stock: stock._id })

        const user = await User.findById(userId)
        console.log(todayPrice)
        if (!user) return res.status(401).json({ error: "User not found" });
        // user.stockOwnership.push({ stock: stock._id, quantity: 10 })
        // user.save()
        if (user.accountBalance >= quantity * price && price > (todayPrice.price * 0.93).toFixed(2) && price < (todayPrice.price * 1.07).toFixed(2)) {
            const buyOrder = new BuyOrder({
                userId,
                stock: stock._id,
                price: price,
                quantity: quantity
            })
            await buyOrder.save();
            user.accountBalance = user.accountBalance - quantity * price
            await user.save()
            await matchOrders(stock._id)
            res.json(buyOrder);
        }
        else
            res.json("wrong");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createSellOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { quantity, stockSymbol, price } = req.body
        const stock = await Stock.findOne({ symbol: stockSymbol })
        const today = new Date();
        const dateOnly = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))
        const todayPrice = await Market.findOne({ date: dateOnly, stock: stock._id })

        const user = await User.findById(userId)
        let userStock = null;
        const stockOwnership = user.stockOwnership;
        // Tìm cổ phiếu có symbol là "VNM" trong mảng stockOwnership
        userStock = stockOwnership.find(stockItem => stockItem.stock.toString() === stock._id.toString());

        console.log(userStock)
        if (!user) return res.status(401).json({ error: "User not found" });

        if (userStock.quantity >= quantity && price > (todayPrice.price * 0.93) && price < (todayPrice.price * 1.07)) {
            const sellOrder = new SellOrder({
                userId,
                stock: stock._id,
                price: price,
                quantity: quantity
            })
            sellOrder.save();
            userStock.quantity = userStock.quantity - quantity
            await user.save()
            matchOrders(stock._id)
            res.json(sellOrder);
        }
        else
            res.json("wrong");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteOrder = async function (req, res) {
    try {
        const { orderId, type } = req.body
        if (type === "buy") {
            const buyOrder = await BuyOrder.findOneAndDelete({ _id: orderId })
            if (buyOrder) {
                const user = await User.findOne({ _id: buyOrder.userId })
                user.accountBalance += buyOrder.price * buyOrder.quantity;
                user.save();
                res.status(200).json({ message: "Xoa thanh cong", buyOrder })
            }
            else {
                res.status(404).json({ message: "Nham lenh xoa" })
            }
        }
        if (type === "sell") {
            const sellOrder = await SellOrder.findOneAndDelete({ _id: orderId })
            if (sellOrder) {
                const user = await User.findOne({ _id: sellOrder.userId })
                const stockIndex = user.stockOwnership.findIndex(item => item.stock.toString() === sellOrder.stock.toString());
                if (stockIndex !== -1) {
                    // Nếu đã sở hữu cổ phiếu, cập nhật số lượng
                    user.stockOwnership[stockIndex].quantity += sellOrder.quantity;
                } else {
                    // Nếu chưa sở hữu cổ phiếu, thêm mới vào danh sách sở hữu
                    buyer.stockOwnership.push({
                        stock: sellOrder.stock,
                        quantity: sellOrder.quantity
                    });
                }
                user.save()
                res.status(200).json({ message: "Xoa thanh cong", sellOrder })
            }
            else {
                res.status(404).json({ message: "Nham lenh xoa" })
            }
        }
        else {
            res.status(404).json({ message: "Nham lenh xoa" })
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { createBuyOrder, createSellOrder, getBuyOrder, getSellOrder, getMatchBuyPrice, getMatchSellPrice, deleteOrder }