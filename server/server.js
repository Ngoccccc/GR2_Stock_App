const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv');
const cors = require('cors')
const connectDB = require('./configs/db.js');
const authRoutes = require('./routes/authRoutes.js')
const tradeRoutes = require('./routes/tradeRoutes.js')
const stockRoutes = require('./routes/stockRoutes.js')
const marketRoutes = require('./routes/marketRoutes.js')
const transactionRoutes = require('./routes/transactionRoutes.js')

dotenv.config();

//database config
connectDB();

const app = express()
// Init middleware
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

// Routes
app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/trade", tradeRoutes);
app.use("/api/v1/stock", stockRoutes)
app.use("/api/v1/market", marketRoutes)
app.use("/api/v1/transaction", transactionRoutes)

app.get("/", (req, res) => {
    res.send("<h1>Hello World</h1>");
});

//routes


//PORT
const PORT = process.env.PORT || 4000;

//run listen
app.listen(PORT, () => {
    console.log(
        `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`
    );
});