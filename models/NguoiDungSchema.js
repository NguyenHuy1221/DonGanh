const mongoose = require("mongoose");
const { Schema } = mongoose;
const {convertToVietnamTimezone} = require('../middleware/index');
const NguoiDungSchema = new Schema({
  anhDaiDien: String,
  tenNguoiDung: String,
  GioiTinh: String,
  soDienThoai: String,
  gmail: String,
  matKhau: String,
  ngayTao: { type: Date, default: Date.now },
  ngaySinh: String,
  hoKinhDoanh: { type: Boolean, default: false },
  tinhTrang: {type :Number, default :0},
  phuongThucThanhToan: [
    { type: Schema.Types.ObjectId, ref: "PhuongThucThanhToan" },
  ],
  role: { type: String, enum: ["user", "admin"] },
  otp: { type: String },
  otpExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
  googleId: { type: String, unique: true, sparse: true },
  facebookId: { type: String, unique: true, sparse: true },
},{
  timestamps:true
});
convertToVietnamTimezone(NguoiDungSchema)
module.exports = mongoose.model("User", NguoiDungSchema);
