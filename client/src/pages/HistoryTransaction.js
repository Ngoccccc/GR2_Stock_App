import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import axios from "axios";
import moment from "moment";
import Layout from "./../components/Layout/Layout";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
const HistoryTransaction = () => {
    const navigate = useNavigate();
    const [auth, setAuth] = useAuth();
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState([])

    const getHistoryTransaction = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/v1/transaction/historyTransaction/`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            setLoading(false);
            setTransaction(data)
            console.log(data);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };
    const handleTableRowClick = (symbol) => {
        navigate(`/stock/${symbol}`);
    };
    useEffect(() => {
        if (auth?.token) getHistoryTransaction();
    }, [auth?.token]);
    console.log(auth);
    return (
        <Layout title={"Lịch sử giao dịch"}>
            <div style={{ marginTop: 100, display: 'flex', justifyContent: 'center' }} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                {transaction.length === 0 ? "Loading" : <TableContainer component={Paper} sx={{ maxWidth: 800 }}>
                    <Table sx={{ minWidth: 650, maxWidth: 800 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Mã chứng khoán</TableCell>
                                <TableCell align="right">Tên công ty</TableCell>
                                <TableCell align="right">Giá </TableCell>
                                <TableCell align="right">Số lượng</TableCell>
                                <TableCell align="right">Loại giao dịch</TableCell>
                                <TableCell align="right">Thời gian giao dịch</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transaction?.map((stock) => (
                                <TableRow
                                    key={stock._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell
                                        component="th"
                                        scope="stock"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleTableRowClick(stock.stock.symbol)}>
                                        {stock.stock.symbol}
                                    </TableCell>
                                    <TableCell align="right">{stock.stock.companyName}</TableCell>
                                    <TableCell align="right" sx={{ color: "#ffc107" }}>{stock.price}</TableCell>
                                    <TableCell align="right">{stock.quantity}</TableCell>
                                    <TableCell align="right" sx={{ color: stock.type === "sell" ? 'secondary.main' : 'primary.main' }}>{stock.type === "sell" ? "Bán" : "Mua"}</TableCell>
                                    <TableCell align="right">{moment(stock.executionTime).format("HH:mm:ss DD/MM/YYYY")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>}
            </div>
        </Layout>
    );
};

export default HistoryTransaction;
