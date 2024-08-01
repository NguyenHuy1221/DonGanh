const express = require("express");
const apiRoute = express.Router();
const thuoctinhRouter = require('../router/thuoctinh')
const sanphamRouter = require('../router/sanpham')

apiRoute.use('/sanpham',(req, res,next)=>{
    console.log('call san pham api router')
    next()
},sanphamRouter);















apiRoute.use('/thuoctinh',(req, res,next)=>{
    console.log('call thuoc tinh api router')
    next()
},thuoctinhRouter);

module.exports = apiRoute;
