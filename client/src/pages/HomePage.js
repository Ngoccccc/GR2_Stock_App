import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  InputBase,
  IconButton,
  Grid
} from '@mui/material/'
import SearchIcon from '@mui/icons-material/Search';

const HomePage = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState([])

  const [searchValue, setSearchValue] = useState(""); // State lưu trữ giá trị của input tìm kiếm

  // Hàm xử lý sự kiện onChange của input tìm kiếm
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  // Hàm lọc danh sách cổ phiếu dựa trên giá trị tìm kiếm
  const filteredStocks = stocks.filter((stock) => {
    return (
      stock.stock.symbol.toLowerCase().includes(searchValue.toLowerCase()) ||
      stock.stock.companyName.toLowerCase().includes(searchValue.toLowerCase())
    );
  });
  const getTodayPrice = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/market/getAll`);
      setLoading(false);
      setStocks(data.data)
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
    getTodayPrice();
  }, []);

  return (
    <Layout title={"Trang chủ"}>
      <Grid style={{ marginTop: 100 }} container
        direction="column"
        justifyContent="center"
        alignItems="center">
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Tìm theo mã cổ phiếu"
            inputProps={{ 'aria-label': 'search stock' }}
            value={searchValue}
            onChange={handleSearchChange}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        <TableContainer component={Paper} sx={{ maxWidth: 800, marginTop: "20px" }}>
          <Table sx={{ minWidth: 650, maxWidth: 800 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Mã chứng khoán</TableCell>
                <TableCell align="right">Tên công ty</TableCell>
                <TableCell align="right">Giá sàn</TableCell>
                <TableCell align="right">Giá tham chiếu</TableCell>
                <TableCell align="right">Giá trần</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStocks.map((stock) => (
                <TableRow
                  key={stock._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  onClick={() => handleTableRowClick(stock.stock.symbol)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell component="th" scope="stock">
                    {stock.stock.symbol}
                  </TableCell>
                  <TableCell align="right">{stock.stock.companyName}</TableCell>
                  <TableCell align="right" sx={{ color: 'info.main' }}>{(stock.price * 0.93).toFixed(2)}</TableCell>
                  <TableCell align="right" sx={{ color: "#ffc107" }}>{stock.price}</TableCell>
                  <TableCell align="right" sx={{ color: 'secondary.main' }}>{(stock.price * 1.07).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Layout>
  );
};

export default HomePage;
