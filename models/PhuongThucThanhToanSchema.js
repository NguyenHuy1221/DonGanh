const mongoose = require("mongoose");
const { Schema } = mongoose;

const phuongThucThanhToanSchema = new Schema({
  ten: { type: String, required: true },
  loai: {
    type: String,
    enum: ["the_tin_dung", "chuyen_khoan", "tien_mat"],
    required: true,
  },
  chiTiet: { type: Schema.Types.Mixed }, // Chi tiết phương thức thanh toán, có thể là thông tin tùy ý
  trangThai: { type: Boolean, default: true }, // Trạng thái của phương thức thanh toán
  ngayTao: { type: Date, default: Date.now }, // Thời điểm tạo phương thức thanh toán
  ngayCapNhat: { type: Date, default: Date.now }, // Thời điểm cập nhật phương thức thanh toán
});

module.exports = mongoose.model(
  "PhuongThucThanhToan",
  phuongThucThanhToanSchema
);
