const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var buyOrderSchema = new mongoose.Schema({
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
    quantity: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('BuyOrder', buyOrderSchema);