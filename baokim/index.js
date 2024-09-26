const express = require("express");
const apiBaokim = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const { refreshToken } = require('../jwt/index');


const API_URL = 'https://dev-api.baokim.vn/payment/api/v5/bpm/list';
async function getPaymentMethods(req, res) {
  const token = refreshToken();
  try {
      const response = await axios.get(API_URL, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      res.status(200).json(response.data);
  } catch (error) {
      console.error('Error fetching payment methods:', error);
      res.status(500).json({ message: 'Error fetching payment methods', error: error.message,token });
  }
}


async function createOrder(req, res, next) {
  try {
    // Tách riêng việc tạo token
    const token = refreshToken();

    const orderData = {
      mrc_order_id: "string", 
      total_amount: 200000,
      description: "test",
      url_success: "https://baokim.vn/",
      merchant_id: 40002, 
      url_detail: "https://baokim.vn/",
      lang: "en",
      bpm_id: 128,
      webhooks: "https://baokim.vn/",
      customer_email: "test@gmail.vn",
      customer_phone: "0888888888",
      customer_name: "Nguyen Van A",
      customer_address: "102 Thai Thinh",
      payment_info: {
        token,
      },
      items: {}, 
      extension: {
        items: [
          {
            item_id: "abc123",
            item_code: "ABC123",
            item_name: "tủ lạnh",
            price_amount: 10000000,
            quantity: 3,
            url: "http://baokim.vn/tu-lanh/abc123",
          },
        ],
      },
    };

    const response = await axios.post('https://dev-api.baokim.vn/payment/api/v5/order/send', orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error creating order:', error);
    let errorMessage = 'Error creating order';
    if (error.response) {
      errorMessage = error.response.data.message || error.response.statusText;
    }
    res.status(error.response && error.response.status ? error.response.status : 500).json({
      message: errorMessage,
    });
  }
}

async function checkToken(req, res) {
  const token = refreshToken();
  try {
    const decoded = jwt.decode(token);
    res.status(201).json(decoded);
    return decoded;
} catch (error) {
    console.error('Error decoding token:', error);
    return null;
}
}
// async function createOrder(req, res, next) {
//     const token = refreshToken();
//     const url = 'https://dev-api.baokim.vn/payment/api/v5/order/send';
//     // const orderData = req.body;
//     const orderData = {
//             mrc_order_id: "string",
//             total_amount: 200000,
//             description: "test",
//             url_success: "https://baokim.vn/",
//             merchant_id: 40002,
//             url_detail: "https://baokim.vn/",
//             lang: "en",
//             bpm_id: 128,
//             webhooks: "https://baokim.vn/",
//             customer_email: "test@gmail.vn",
//             customer_phone: "0888888888",
//             customer_name: "Nguyen Van A",
//             customer_address: "102 Thai Thinh",
//             payment_info: {
//               token: token
//             },
//             items: {},
//             extension: {
//               items: [
//                 {
//                   item_id: "abc123",
//                   item_code: "ABC123",
//                   item_name: "tủ lạnh",
//                   price_amoun: 10000000,
//                   quantity: 3,
//                   url: "http://baokim.vn/tu-lanh/abc123"
//                 }
//               ]
//             }
          
//       };
//     try {
//       const response = await axios.post(url, orderData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
  
//       res.status(201).json(response.data);
//     } catch (error) {
//     //   console.error('Error creating order:', error.response ? error.response.data : error.message);
//     // console.error('Error creating order:', error.response ? error.response.data : error.message);
//     res.status(error.response && error.response.status ? error.response.status : 500).json({
//       message: 'Error creating order',
//       error: error.response ? error.response.data : error.message
//     });

//     }
//   }



apiBaokim.get('/checkToken', checkToken);
apiBaokim.get('/getPaymentMethods', getPaymentMethods);
apiBaokim.post('/createOrder', createOrder);
  module.exports = apiBaokim;
