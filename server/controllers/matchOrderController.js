const BuyOrder = require("../models/buyOrderModel");
const SellOrder = require("../models/sellOrderModel");
const HistoryTransaction = require("../models/historyTransactionModel");
const User = require("../models/userModel");

async function matchOrders(stockId) {
    const buyOrders = await BuyOrder.find({ stock: stockId }).sort({ price: -1, createdAt: 1 });
    const sellOrders = await SellOrder.find({ stock: stockId }).sort({ price: 1, createdAt: 1 });

    buyOrders.forEach(order => console.log(order.price))
    console.log("---------");
    sellOrders.forEach(order => console.log(order.price))
    //Xử lý khớp lệnh

    while (buyOrders.length > 0 && sellOrders.length > 0) {
        let buyOrder = buyOrders[0];
        let sellOrder = sellOrders[0];

        if (buyOrder.price >= sellOrder.price) {
            const matchedQuantity = Math.min(buyOrder.quantity, sellOrder.quantity);

            // Thực hiện giao dịch
            const transaction = new HistoryTransaction({
                userId: buyOrder.userId,
                stock: stockId,
                price: sellOrder.price,
                type: "buy",
                quantity: matchedQuantity,
                executionTime: Date.now()
            });
            await transaction.save();

            const sellTransaction = new HistoryTransaction({
                userId: sellOrder.userId,
                stock: stockId,
                price: sellOrder.price,
                type: "sell",
                quantity: matchedQuantity,
                executionTime: Date.now()
            });
            await sellTransaction.save();
            // Cập nhật số lượng của buyOrder và sellOrder
            buyOrder.quantity -= matchedQuantity;
            sellOrder.quantity -= matchedQuantity;
            console.log("buyorder: " + buyOrder.quantity, "sellorder: " + sellOrder.quantity);
            if (buyOrder.quantity > 0) {
                // Thêm lại buyOrder vào vị trí phù hợp
                buyOrders.shift();
                buyOrders.push(buyOrder);
                await BuyOrder.findByIdAndUpdate(buyOrder._id, { quantity: buyOrder.quantity });
                buyOrders.sort((a, b) => b.price - a.price);
                console.log("buy order", buyOrders);
            } else {
                // Nếu buyOrder đã hết, xóa khỏi mảng
                buyOrders.shift();
                await BuyOrder.findByIdAndRemove(buyOrder._id);
            }

            if (sellOrder.quantity > 0) {
                // Thêm lại sellOrder vào vị trí phù hợp
                sellOrders.shift();
                sellOrders.push(sellOrder);
                await SellOrder.findByIdAndUpdate(sellOrder._id, { quantity: sellOrder.quantity })
                sellOrders.sort((a, b) => b.price - a.price);
                console.log("sell order", sellOrders);
            } else {
                // Nếu sellOrder đã hết, xóa khỏi mảng
                sellOrders.shift();
                await SellOrder.findByIdAndRemove(sellOrder._id);
            }

            // Cập nhật số lượng cổ phiếu của người mua
            const buyer = await User.findById(buyOrder.userId);
            const stockIndex = buyer.stockOwnership.findIndex(item => item.stock.toString() === stockId.toString());

            buyer.accountBalance += (buyOrder.price - sellOrder.price) * matchedQuantity;

            if (stockIndex !== -1) {
                // Nếu đã sở hữu cổ phiếu, cập nhật số lượng
                buyer.stockOwnership[stockIndex].quantity += matchedQuantity;
            } else {
                // Nếu chưa sở hữu cổ phiếu, thêm mới vào danh sách sở hữu
                buyer.stockOwnership.push({
                    stock: stockId,
                    quantity: matchedQuantity
                });
            }

            await buyer.save();

            // Cập nhật số tiền của người bán
            const seller = await User.findById(sellOrder.userId);
            seller.accountBalance += sellOrder.price * matchedQuantity;
            await seller.save();
        }
        else {
            break;
        }
    }
}

module.exports = { matchOrders };