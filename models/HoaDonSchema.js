const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HoaDonSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    khuyenmaiId: { type: mongoose.Schema.Types.ObjectId, ref: "KhuyenMai" },
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
    NgayTao: { type: Date, default: Date.now },
});

const HoaDon = mongoose.model('HoaDon', HoaDonSchema);
module.exports = HoaDon; 