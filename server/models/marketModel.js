const mongoose = require('mongoose');

var marketSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        index: true,
    },
    stock: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock',
        required: true
    },
    price: {
        type: Number,
        required: true
    }
    ,
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Market', marketSchema);