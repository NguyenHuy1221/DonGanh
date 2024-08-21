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
  otp: { type: String },
  otpExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
  googleId: { type: String, unique: true, sparse: true },
  facebookId: { type: String, unique: true, sparse: true },
});

module.exports = mongoose.model("User", NguoiDungSchema);
