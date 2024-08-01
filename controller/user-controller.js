const UserModel = require("../models/NguoiDungSchema");
const transporter = require("./mailer");
require("dotenv").config();
const { hashPassword, comparePassword, generateToken } = require("../untils");
const crypto = require("crypto");

async function RegisterUser(req, res) {
  const { tenNguoiDung, gmail, matKhau } = req.body;
  const hash_pass = await hashPassword(matKhau);

  try {
    if (!tenNguoiDung || !gmail || !matKhau) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đầy đủ thông tin người dùng" });
    }

    const checkEmail = await UserModel.findOne({ gmail: gmail });
    if (checkEmail) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Tạo mã OTP 6 chữ số
    const otpExpiry = Date.now() + 15 * 60 * 1000; // OTP hết hạn sau 15 phút

    await UserModel.create({
      tenNguoiDung,
      matKhau: hash_pass,
      otp,
      otpExpiry,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: gmail,
      subject: "Xác nhận đăng ký tài khoản",
      text: `Chào ${tenNguoiDung},\n\nVui lòng sử dụng mã OTP sau để xác nhận tài khoản của bạn:\n\n${otp}\n\nTrân trọng,\nĐội ngũ hỗ trợ`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Lỗi khi gửi email:", error);
      } else {
        console.log("Email đã được gửi:", info.response);
      }
    });

    return res.json({
      message:
        "Thêm người dùng thành công, vui lòng kiểm tra email để nhận OTP",
    });
  } catch (error) {
    console.error("Lỗi khi thêm người dùng:", error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi thêm người dùng" });
  }
}

async function VerifyOTP(req, res) {
  const { gmail, otp } = req.body;

  try {
    const user = await UserModel.findOne({ gmail: gmail });

    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res
        .status(400)
        .json({ message: "OTP không hợp lệ hoặc đã hết hạn" });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.json({
      message: "Xác nhận OTP thành công, tài khoản đã được kích hoạt",
    });
  } catch (error) {
    console.error("Lỗi khi xác nhận OTP:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi khi xác nhận OTP" });
  }
}

module.exports = { RegisterUser, VerifyOTP };
