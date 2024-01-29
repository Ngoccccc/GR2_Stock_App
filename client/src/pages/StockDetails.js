import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetailsStyles.css";
import { useAuth } from "../context/auth";
import toast from "react-hot-toast";
import moment from 'moment';
import { LineChart } from '@mui/x-charts/LineChart';
const StockDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState([]);
  const [auth, setAuth] = useAuth();


  //initalp details
  useEffect(() => {
    if (params?.slug) getStock();
  }, [params?.slug]);
  const getStock = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/market/searchStock/${params.slug}`
      );
      setStock(data?.stock);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div style={{ marginTop: 100, display: 'flex', justifyContent: 'center' }} sx={{ justifyContent: 'center', alignItems: 'center' }}>
        <LineChart
          width={500}
          height={300}
          series={[
            { data: stock.map(stock => (stock.price)), label: params?.slug },
          ]}
          xAxis={[{ scaleType: 'point', data: stock.map(stock => (moment(stock.date).format('DD/MM'))) }]}
        />
      </div>
    </Layout>
  );
};

export default StockDetails;