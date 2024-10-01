const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//việc lưu địa chỉ ở schema hóa đơn nhằm hiểu rỡ đơn đó từng được giao ở vị trí nào
const {convertToVietnamTimezone} = require('../middleware/index');
const getCurrentDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây và mili giây về 0
  // Điều chỉnh múi giờ
  const timezoneOffset = today.getTimezoneOffset() * 60000; // Chuyển đổi phút sang mili giây
  const localMidnight = new Date(today.getTime() - timezoneOffset);
  return localMidnight;
};
const HoaDonSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderId: {type : String},
    khuyenmaiId: { type: mongoose.Schema.Types.ObjectId, ref: "KhuyenMai" },
    diaChi: {
      tinhThanhPho: String,
      quanHuyen: String,
      phuongXa: String,
      duongThon: String,
      Name: { type: String},
      SoDienThoai: { type: String },
    },
    TongTien: Number,
    TrangThai: Number,
    ThanhToan: { type: Boolean, default: false },
    transactionId: { type: Number,},
    chiTietHoaDon: [
      {
        
        BienThe: { 
        IDSanPham: { type: Schema.Types.ObjectId, ref: 'SanPham' },
        sku: String,
        gia: Number,
        soLuong: Number,
        KetHopThuocTinh: [{
          GiaTriThuocTinh:{
            ThuocTinh: {
              TenThuocTinh: { type: String, required: true }, // Tham chiếu đến thuộc tính
            },
          GiaTri: { type: String, required: true },
        }
      }]
         },
        soLuong: Number,
        donGia: Number,
      },
    ],
    GhiChu: String,
    NgayTao: { type: Date, default: getCurrentDate },
});
convertToVietnamTimezone(HoaDonSchema)
const HoaDon = mongoose.model('HoaDon', HoaDonSchema);
module.exports = HoaDon; 