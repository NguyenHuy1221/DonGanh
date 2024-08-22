const express = require('express');
const sanphamRouter = express.Router();
const { getlistSanPham,
    createSanPham,
    createThuocTinhSanPham,
    createSanPhamVoiBienThe,
    createbienthesanpham,
    getlistBienTheFake,
    createBienTheFake,
    updateSanPham,
    deleteSanPham,
    findSanPham,
    getlistPageSanPham,} = require("../controller/sanpham-controller")

sanphamRouter.get('/getlistSanPham', async function (req, res) {
    return getlistSanPham(req, res);
})

sanphamRouter.post('/createSanPham', async function (req, res) {
    return createSanPham(req, res);
})

sanphamRouter.post('/createThuocTinhSanPham', async function (req, res) {
    return createThuocTinhSanPham(req, res);
})
sanphamRouter.post('/createbienthesanpham', async function (req, res) {
    return createbienthesanpham(req, res);
})

sanphamRouter.post('/createSanPhamVoiBienThe', async function (req, res) {
    return createSanPhamVoiBienThe(req, res);
})

sanphamRouter.get('/getlistBienTheFake', async function (req, res) {
    return getlistBienTheFake(req, res);
})
sanphamRouter.post('/createBienTheFake', async function (req, res) {
    return createBienTheFake(req, res);
})


sanphamRouter.put('/updateReview', async function (req, res) {
    return updateReview(req, res);
})
sanphamRouter.delete('/deleteReview', async function (req, res) {
    return DeleteReview(req, res);
})

sanphamRouter.get('/getlistPageSanPham', async function (req, res) {
    return getlistPageSanPham(req, res);
})



module.exports = sanphamRouter;