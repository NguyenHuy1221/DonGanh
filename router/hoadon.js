const express = require('express');
const hoadonRouter = express.Router();
const {getlistHoaDon,
    getHoaDonById,
    updateUserDiaChivaThongTinGiaoHang,
    } = require("../controller/HoaDon-controller")

hoadonRouter.get('/getlistHoaDon', async function (req, res) {
        return getlistHoaDon(req, res);
    })
    

    hoadonRouter.get("/getHoaDonById/:hoadonId", function (req, res) {
        return getHoaDonById(req, res);
      });

hoadonRouter.post('/updateUserDiaChivaThongTinGiaoHang', async function (req, res) {
    return updateUserDiaChivaThongTinGiaoHang(req, res);
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