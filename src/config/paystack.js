import axios from 'axios';
import config from './index.js';

const paystackClient = axios.create({
  baseURL: `${config.paystack.baseUrl}`,
  headers: {
    Authorization: `Bearer ${config.paystack.secretKey}`,
    'Content-Type': 'application/json'
  }
});

export default paystackClient;
