const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var historyTransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stock: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock',
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ["buy", "sell"],
    },
    quantity: {
        type: Number,
        required: true
    },
    executionTime: {
        type: Date, // Thêm trường thời gian thực hiện
        default: Date.now
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('HistoryTransaction', historyTransactionSchema);