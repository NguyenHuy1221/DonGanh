const monggose = require("mongoose");
const { Schema } = monggose;

const userSchema = new Schema({
  hinh: String,
  ten: String,
  diaChi: String,
  soDienThoai: Number,
  gmail: String,
  matKhau: String,
  ngayTao: { type: Date, default: Date.now },
  tinhTrang: String,
  role: { type: String, enum: ["user", "admin"] },
  otp: String, // Trường lưu mã OTP
  verificationToken: { type: String },
  isVerified: { type: Boolean, default: false },
});

module.exports = monggose.model("User", userSchema);
