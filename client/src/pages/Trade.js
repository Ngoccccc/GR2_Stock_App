import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import axios from "axios";
import { useAuth } from "../context/auth";
import moment from "moment";
import toast from "react-hot-toast";
import {
    CardContent,
    Typography,
    CardActions,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    Autocomplete,
    TextField,
} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
const Trade = () => {
    const [buyStocks, setBuyStocks] = useState([])
    const [sellStocks, setSellStocks] = useState([])
    const [tradeRadio, setTradeRadio] = useState("buy")
    const [selectedStock, setSelectedStock] = useState("")
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [total, setTotal] = useState(0);
    const [auth, setAuth] = useAuth();
    const [orders, setOrders] = useState([])

    const [matchPrice, setMatchPrice] = useState(0);
    const getTodayPrice = async () => {
        try {
            const { data } = await axios.get(`/api/v1/market/getAll`);
            console.log(data);
            setBuyStocks(data.data)

        } catch (error) {
            console.log(error);
        }
    };

    const getOrder = async () => {
        try {
            const sell = await axios.get(`/api/v1/trade/getSellOrder/`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            const buy = await axios.get(`/api/v1/trade/getBuyOrder/`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            const sellOrders = sell.data.map((stock) => ({ ...stock, type: "sell" }))
            const buyOrders = buy.data.map((stock) => ({ ...stock, type: "buy" }))
            const orders = [...sellOrders, ...buyOrders]
            orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(orders)
            console.log(sellOrders, buyOrders);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (auth?.user) getOrder()
    }, [auth?.user]);

    useEffect(() => {
        if (auth?.user) {
            const { stockOwnership } = auth?.user;
            setSellStocks(stockOwnership);
        }
    }, [auth?.user]);

    useEffect(() => {
        getTodayPrice();
    }, []);

    const tradeRadioOnChange = (e) => {
        setTradeRadio(e.target.value)
        setSelectedStock("")
    }

    const handleSelectStock = async (event, value) => {
        if (value) {
            if (value.price) {
                console.log("Quantity:", value.price);
                setSelectedStock(value)
            }
            else {
                const stock = buyStocks.filter(stock => stock.stock._id === value.stock._id)[0]
                setSelectedStock({ ...stock, quantity: value.quantity })
            }
            if (tradeRadio === "buy") {
                try {
                    const data = await axios.post(`/api/v1/trade/getMatchBuyPrice`, { stockSymbol: value.stock.symbol });
                    console.log(data.data);
                    setMatchPrice(data.data)
                } catch (error) {
                    console.log(error);
                }
            }
            if (tradeRadio === "sell") {
                try {
                    const data = await axios.post(`/api/v1/trade/getMatchSellPrice`, { stockSymbol: value.stock.symbol });
                    console.log(data.data);
                    setMatchPrice(data.data)
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };
    const handleQuantityChange = (event) => {
        const newQuantity = parseInt(event.target.value);
        setQuantity(newQuantity);
        calculateTotal(newQuantity, price);
    };

    const handlePriceChange = (event) => {
        const newPrice = parseFloat(event.target.value);
        setPrice(newPrice);
        calculateTotal(quantity, newPrice);
    };

    const calculateTotal = (newQuantity, newPrice) => {
        if (isNaN(newQuantity) || isNaN(newPrice)) {
            setTotal(0);
        } else {
            const newTotal = newQuantity * newPrice;
            setTotal(newTotal);
        }
    };

    const handleOrderStock = async () => {
        try {
            if (tradeRadio === "buy") {
                const data = await axios.post(`/api/v1/trade/buy`, {
                    price,
                    stockSymbol: selectedStock.stock.symbol,
                    quantity
                }, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
            }
            else {
                const data = await axios.post(`/api/v1/trade/sell`, {
                    price,
                    stockSymbol: selectedStock.stock.symbol,
                    quantity
                }, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
            }
            toast.success("Đặt lệnh thành công");
            setPrice(0)
            setQuantity(0)
            setSelectedStock('')
            getOrder()
        } catch (error) {
            console.log(error);
        }
    }
    const handleCancelOrder = async (orderId, type) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn lệnh này?");
        if (isConfirmed) {
            try {
                const data = await axios.delete(`/api/v1/trade/deleteOrder`, {
                    data: { orderId, type }
                });
            } catch (error) {
                console.log(error);
            }
            const updatedOrders = orders.filter(order => order._id !== orderId);
            setOrders(updatedOrders);
        }
    }
    return (
        <Layout title={"Tradding page"}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box style={{ marginTop: "100px" }} sx={{ display: 'flex', flexDirection: 'row', width: "70%" }}>
                    <Grid container>
                        <Grid xs={8} sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Grid xs={8} >
                                <Card sx={{ width: "80%", display: 'flex', flexDirection: 'column' }}>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                                            Đặt lệnh
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', paddingTop: "10px", paddingRight: "30px" }}>
                                                Lệnh đặt
                                            </Typography>
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="row-radio-buttons-group"
                                                defaultValue="buy"
                                                onChange={tradeRadioOnChange}
                                            >
                                                <FormControlLabel value="buy" control={<Radio />} label="Mua" />
                                                <FormControlLabel value="sell" control={<Radio />} label="Bán" />
                                            </RadioGroup>
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', paddingY: "10px" }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', paddingTop: "10px", paddingRight: "40px" }}>
                                                Mã CK
                                            </Typography>
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={tradeRadio === "buy" ? buyStocks : sellStocks}
                                                size="small"
                                                sx={{ width: 150 }}

                                                getOptionLabel={(option) => option.stock.symbol}
                                                onChange={handleSelectStock}
                                                renderInput={(params) => <TextField {...params} label="Mã CK" />}
                                            />
                                            {tradeRadio === "sell" && (<>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', paddingTop: "10px", paddingLeft: "40px" }}>
                                                    Hiện có: {selectedStock.quantity}
                                                </Typography>
                                            </>)}
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', paddingY: "10px" }}>
                                            <TextField
                                                error={selectedStock.quantity && selectedStock.quantity < quantity}
                                                id="outlined-multiline-flexible"
                                                label="Khối lượng"
                                                multiline
                                                size="small"

                                                maxRows={4}
                                                helperText={(selectedStock.quantity && selectedStock.quantity < quantity) && "Số lượng bán phải nhỏ hơn số cổ phiếu sở hữu"}
                                                onChange={handleQuantityChange}
                                            />
                                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', paddingTop: "10px", paddingX: "10px" }}>
                                                X
                                            </Typography>
                                            <TextField
                                                error={!(price > (selectedStock.price * 0.93).toFixed(2) && price < (selectedStock.price * 1.07).toFixed(2) || price == 0)}
                                                id="outlined-textarea"
                                                label="Giá"
                                                multiline
                                                size="small"

                                                helperText={!(price > (selectedStock.price * 0.93).toFixed(2) && price < (selectedStock.price * 1.07).toFixed(2) || price == 0) && "Giá cần nằm trong khoảng giá sàn đến giá trần"}
                                                onChange={handlePriceChange}
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', paddingY: "10px" }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', paddingTop: "10px", paddingRight: "15px" }}>
                                                Thành tiền
                                            </Typography>
                                            <TextField
                                                defaultValue="0"
                                                size="small"
                                                value={total}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                        </Box>
                                    </CardContent>
                                    <CardActions>
                                        <Button onClick={handleOrderStock} size="small" variant="contained" sx={{ textAlign: 'center' }}>Đặt lệnh</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                            <Grid xs={4}>
                                <Card sx={{ width: "80%" }}>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                                            Giá trực tuyến
                                        </Typography>
                                        <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Box>

                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', paddingY: "5px", }}>
                                                    Trần
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', paddingY: "5px", }}>
                                                    Sàn
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', paddingY: "5px" }}>
                                                    Tham chiếu
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', paddingY: "5px", }}>
                                                    Giá khớp
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', paddingY: "5px", }}>
                                                    {selectedStock ? (selectedStock.price * 1.07).toFixed(2) : "---"}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', paddingY: "5px", }}>
                                                    {selectedStock ? (selectedStock.price * 0.93).toFixed(2) : "---"}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', paddingY: "5px" }}>
                                                    {selectedStock ? selectedStock.price : "---"}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', paddingY: "5px", }}>
                                                    {selectedStock && matchPrice != -1 ? matchPrice : "---"}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        <Grid xs={4}>
                            <Card sx={{ width: "80%" }}>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                                        Lệnh chờ khớp
                                    </Typography>
                                    {orders.length === 0 ? "Loading" :
                                        <Grid container spacing={2}>
                                            {orders?.map((item) => (
                                                <Grid item key={item._id} xs={12} sm={6}>
                                                    <Card variant="outlined">
                                                        <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
                                                            <Typography variant="h5" component="h2">
                                                            </Typography>
                                                            <Button
                                                                sx={{
                                                                    color: 'white',
                                                                    color: 'red',
                                                                    padding: "0px",
                                                                    minWidth: "0px"
                                                                }}
                                                                onClick={() => handleCancelOrder(item._id, item.type)}>
                                                                <CancelIcon />
                                                            </Button>
                                                        </Grid>
                                                        <CardContent sx={{
                                                            paddingY: "0px",
                                                            minWidth: "0px"
                                                        }}>
                                                            <Typography variant="h5" component="h2">
                                                                {item.stock.symbol}
                                                            </Typography>
                                                            <Typography color="textSecondary">
                                                                Khối lượng: {item.quantity}
                                                            </Typography>
                                                            <Typography color="textSecondary">
                                                                Giá: {item.price}
                                                            </Typography>
                                                            <Typography color="textSecondary">
                                                                Thời gian: {moment(item.createdAt).format("HH:mm:ss DD/MM/YYYY")}
                                                            </Typography>

                                                        </CardContent>
                                                        {item.type === "sell" ?
                                                            <Typography color="white" sx={{ textAlign: 'center', paddingY: '10px', bgcolor: 'info.main' }}>
                                                                Lệnh bán
                                                            </Typography> :
                                                            <Typography color="white" sx={{ textAlign: 'center', paddingY: '10px', bgcolor: 'secondary.main' }}>
                                                                Lệnh mua
                                                            </Typography>}
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Layout>
    );
};

export default Trade;
