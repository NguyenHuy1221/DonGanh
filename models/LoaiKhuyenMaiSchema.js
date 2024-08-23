const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Schema cho biến thể sản phẩm
const LoaiKhuyenMaiSchema = new Schema({
    IDLoaiKhuyenMai: { type: String, required: true, unique: true }, // Giả sử có một schema SanPham
    TenLoaiKhuyenMai: String,
    LoaiKhuyenMai: String,
    MoTa: String,
    NgayBatDau: String,
    NgayKetThuc: Number,
  });

  const LoaiKhuyenMai = mongoose.model('LoaiKhuyenMai', LoaiKhuyenMaiSchema);

module.exports = LoaiKhuyenMai; 