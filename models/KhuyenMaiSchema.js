const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Schema cho biến thể sản phẩm
const {convertToVietnamTimezone} = require('../middleware/index');
const KhuyenMaiSchema = new Schema({// Giả sử có một schema SanPham
    TenKhuyenMai: String,
    MoTa: String,
    GiaTriKhuyenMai: String,
    GioiHanSoLuong: String,
    GioiHanGiaTriDuocApDung: String,
    NgayBatDau: { type: Date, default: Date.now },
    NgayKetThuc: Date,
    soLuong: Number,
    IDLoaiKhuyenMai: { type: Schema.Types.ObjectId, ref: 'SanPham' },
    IDDanhMucCon: { type: Schema.Types.ObjectId, ref: 'DanhMuc' },
    TrangThai: Number,
    isDeleted: { type: Boolean, default: false } 

  });
convertToVietnamTimezone(KhuyenMaiSchema)
  const KhuyenMai = mongoose.model('KhuyenMai', KhuyenMaiSchema);

module.exports = KhuyenMai; 