const express = require('express');
const thuoctinhRouter = express.Router();
const {createDanhMuc,
    getlistDanhMuc,
    } = require("../controller/danhmuc-controller")

    thuoctinhRouter.get('/getlistDanhMuc', async function (req, res) {
        return getlistDanhMuc(req, res);
    })
    

thuoctinhRouter.get('/findThuocTinh', async function (req, res) {
    return findThuocTinh(req, res);
})

thuoctinhRouter.post('/createDanhMuc', async function (req, res) {
    return createDanhMuc(req, res);
})

thuoctinhRouter.put('/updateThuocTinh', async function (req, res) {
    return updateThuocTinh(req, res);
})
thuoctinhRouter.delete('/deleteThuocTinh', async function (req, res) {
    return deleteThuocTinh(req, res);
})




module.exports = thuoctinhRouter;