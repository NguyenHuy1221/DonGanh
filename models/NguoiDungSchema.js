const mongoose = require("mongoose");
const { Schema } = mongoose;

const NguoiDungSchema = new Schema({
  anhDaiDien: String,
  tenNguoiDung: String,
  soDienThoai: Number,
  gmail: String,
  matKhau: String,
  ngayTao: { type: Date, default: Date.now },
  ngaySinh: String,
  hoKinhDoanh: { type: Boolean, default: false },
  diaChi: [String],
  tinhTrang: String,
  phuongThucThanhToan: [
    { type: Schema.Types.ObjectId, ref: "PhuongThucThanhToan" },
  ],
  role: { type: String, enum: ["user", "admin"] },
  otp: String, // Trường lưu mã OTP
  verificationToken: { type: String },
  isVerified: { type: Boolean, default: false },
});

module.exports = monggose.model("User", NguoiDungSchema);
