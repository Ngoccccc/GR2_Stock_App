const mongoose = require('mongoose');;

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        const conn = await mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/Stocks");
        console.log(
            `Connected to mongoDB ${conn.connection.host}`
        );
    } catch (error) {
        console.log(`Failed to connect mongoDB ${error}`);
    }
};

module.exports = connectDB;