const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Schema cho biến thể sản phẩm
const {convertToVietnamTimezone} = require('../middleware/index');
const KhuyenMaiSchema = new Schema({// Giả sử có một schema SanPham
    TenKhuyenMai: String,
    MoTa: String,
    GiaTriKhuyenMai: Number,
    TongSoLuongDuocTao: Number,
    GioiHanGiaTriDuocApDung: Number,
    NgayBatDau: { type: Date},
    NgayKetThuc: Date,
    SoLuongHienTai: Number,
    IDLoaiKhuyenMai: { type: Schema.Types.ObjectId, ref: 'SanPham' },
    IDDanhMucCon: { type: Schema.Types.ObjectId, ref: 'DanhMuc.DanhMucCon' },
    TrangThai: Number,
    isDeleted: { type: Boolean, default: false } 

  });
convertToVietnamTimezone(KhuyenMaiSchema)
  const KhuyenMai = mongoose.model('KhuyenMai', KhuyenMaiSchema);

module.exports = KhuyenMai; 