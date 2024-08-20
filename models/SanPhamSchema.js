const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SanPhamSchema = new Schema({
  IDSanPham: { type: String, required: true, unique: true }, // Khóa chính, duy nhất
  TenSanPham: { type: String, required: true },
  HinhSanPham: { type: String }, // Giả sử lưu đường dẫn hoặc ID hình ảnh
  DonGiaNhap: { type: Number, required: true },
  DonGiaBan: { type: Number, required: true },
  SoLuongNhap: { type: Number, default: 0 },
  SoLuongHienTai: { type: Number, default: 0 },
  PhanTramGiamGia: { type: Number },
  NgayTao: { type: Date, default: Date.now },
  TinhTrang: { type: String }, // Ví dụ: 'Còn hàng', 'Hết hàng'
  //  TinhTrang: { type: String, enum: ['Còn hàng', 'Hết hàng', 'Ngừng kinh doanh'] },
  MoTa: { type: String },
  Unit: { type: String }, // Đơn vị tính
  HinhBoSung: [{
    TenAnh: { type: String, required: true },
    UrlAnh: { type: String, required: true },
  }],
  DanhSachThuocTinh: [{
    thuocTinh: { type: Schema.Types.ObjectId, ref: 'ThuocTinh' }
}],
  
  IDDanhMuc: { type: String, ref: 'DanhMuc' }, // Tham chiếu đến danh mục cha
  IDDanhMucCon: { type: String, ref: 'DanhMucCon' } // Tham chiếu đến danh mục con
});

const SanPham = mongoose.model('SanPham', SanPhamSchema);

module.exports = SanPham;
