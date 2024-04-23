import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
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
  Avatar
} from "@mui/material";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import { deepOrange, deepPurple } from '@mui/material/colors';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
const Profile = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState(0);
  const [stockOwnership, setStockOwnership] = useState([]);

  useEffect(() => {
    if (auth?.user) {
      const { email, name, accountBalance, stockOwnership } = auth?.user;
      setName(name);
      setBalance(accountBalance);
      setEmail(email);
      setStockOwnership(stockOwnership);
    }
  }, [auth?.user]);
  const handleTableRowClick = (symbol) => {
    navigate(`/stock/${symbol}`);
  };
  return (
    <Layout title={"Thông tin cá nhân"}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box style={{ marginTop: "100px" }} sx={{ display: 'flex', flexDirection: 'row', width: "70%" }}>
          <Grid container>
            <Grid xs={4} sx={{ display: 'flex', flexDirection: 'row' }}>
              <Grid xs={8}>
                <Card sx={{ width: "80%" }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                      Thông tin cá nhân
                    </Typography>
                    <Avatar sx={{ bgcolor: deepOrange[500] }} >{name[0]}</Avatar>
                    <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Box>

                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', paddingY: "5px", }}>
                          Họ và tên:
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', paddingY: "5px", }}>
                          Email:
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', paddingY: "5px" }}>
                          Số dư tiền mặt:
                        </Typography>

                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', paddingY: "5px", }}>
                          {name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', paddingY: "5px", }}>
                          {email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', paddingY: "5px" }}>
                          {(balance * 1000).toLocaleString('en-US')}đ
                        </Typography>
                      </Box>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Grid xs={8}>
              <Card sx={{ width: "80%" }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    Cổ phiếu đang sở hữu
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxWidth: 800 }}>
                    <Table sx={{ minWidth: 650, maxWidth: 800 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Mã chứng khoán</TableCell>
                          <TableCell align="right">Tên công ty</TableCell>
                          <TableCell align="right">Số lượng</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stockOwnership?.map((stock) => (
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
                            <TableCell align="right">{stock.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
};

export default Profile;
