const express = require('express');
const hoadonRouter = express.Router();
const {getlistHoaDon,
    getHoaDonByUserId,
    getHoaDonByHoaDonId,
    createUserDiaChivaThongTinGiaoHang,
    updateTransactionHoaDon,
    Checkdonhangbaokim,
    } = require("../controller/HoaDon-controller")

hoadonRouter.get('/getlistHoaDon', async function (req, res) {
        return getlistHoaDon(req, res);
})
    

hoadonRouter.get("/getHoaDonByUserId/:userId", function (req, res) {
    return getHoaDonByUserId(req, res);
      });
hoadonRouter.get("/getHoaDonByHoaDonId/:hoadonId", function (req, res) {
    return getHoaDonByHoaDonId(req, res);
});


hoadonRouter.post('/createUserDiaChivaThongTinGiaoHang', async function (req, res) {
    return createUserDiaChivaThongTinGiaoHang(req, res);
})
hoadonRouter.post('/updateTransactionHoaDon/:hoadonId', async function (req, res) {
    return updateTransactionHoaDon(req, res);
})
hoadonRouter.get('/Checkdonhangbaokim/:orderId', async function (req, res) {
    return Checkdonhangbaokim(req, res);
})

// hoadonRouter.get('/findThuocTinh', async function (req, res) {
//     return findThuocTinh(req, res);
// })

// hoadonRouter.post('/createThuocTinh', async function (req, res) {
//     return createThuocTinh(req, res);
// })

// hoadonRouter.put('/updateThuocTinh', async function (req, res) {
//     return updateThuocTinh(req, res);
// })
// hoadonRouter.delete('/deleteThuocTinh', async function (req, res) {
//     return deleteThuocTinh(req, res);
// })




module.exports = hoadonRouter;