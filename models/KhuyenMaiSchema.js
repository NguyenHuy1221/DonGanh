const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Schema cho biến thể sản phẩm
const KhuyenMaiSchema = new Schema({
    IDKhuyenMai: { type: String, required: true, unique: true }, // Giả sử có một schema SanPham
    TenKhuyenMai: String,
    MoTa: String,
    GiaTriKhuyenMai: String,
    GioiHanSoLuong: String,
    GioiHanGiaTriDuocApDung: String,
    NgayBatDau: String,
    NgayKetThuc: Number,
    soLuong: Number,
    IDLoaiKhuyenMai: { type: Schema.Types.ObjectId, ref: 'SanPham' },
    IDNhomSanPhamDuocKhuyenMai: { type: Schema.Types.ObjectId, ref: 'SanPham' },

  });

  const KhuyenMai = mongoose.model('KhuyenMai', KhuyenMaiSchema);

module.exports = KhuyenMai; 