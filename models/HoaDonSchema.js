const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//việc lưu địa chỉ ở schema hóa đơn nhằm hiểu rỡ đơn đó từng được giao ở vị trí nào
const HoaDonSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    khuyenmaiId: { type: mongoose.Schema.Types.ObjectId, ref: "KhuyenMai" },
    diaChi: {
      tinhThanhPho: String,
      quanHuyen: String,
      phuongXa: String,
      duongThon: String
    },
    TongTien: Number,
    TrangThai: String,
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    chiTietHoaDon: [
      {
        idBienThe: { type: mongoose.Schema.Types.ObjectId, ref: "BienThe" },
        soLuong: Number,
        donGia: Number,
      },
    ],
    GhiChu: String,
    NgayTao: { type: Date, default: Date.now },
});

const HoaDon = mongoose.model('HoaDon', HoaDonSchema);
module.exports = HoaDon; 