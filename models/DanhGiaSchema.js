const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DanhGiaSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sanphamId: { type: mongoose.Schema.Types.ObjectId, ref: "SanPham" },
    XepHang: Number,
    BinhLuan: String,
    PhanHoi: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        BinhLuan: String,
        NgayTao: { type: Date, default: Date.now },
      },
    ],
    NgayTao: { type: Date, default: Date.now },
});

const DanhGia = mongoose.model('DanhGia', DanhGiaSchema);
module.exports = DanhGia; 