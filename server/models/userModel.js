const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    stockOwnership: [
        {
            stock: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Stock',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    accountBalance: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('User', userSchema);