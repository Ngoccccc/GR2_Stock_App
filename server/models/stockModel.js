const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var stockSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        index: true,
    },
    symbol: {
        type: String,
        required: true,
        unique: true,
    },
});

//Export the model
module.exports = mongoose.model('Stock', stockSchema);