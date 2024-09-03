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

    const otp = Math.floor(1000 + Math.random() * 900000).toString(); // Tạo mã OTP 4 chữ số
    const otpExpiry = Date.now() + 15 * 60 * 1000; // OTP hết hạn sau 15 phút

    await UserModel.create({
      tenNguoiDung,
      matKhau: hash_pass,
      gmail,
      otp,
      otpExpiry,
      isVerified: false,
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
    user.isVerified = true;
    await user.save();

    return res.json({
      message: "Xác nhận OTP thành công, tài khoản đã được kích hoạt",
    });
  } catch (error) {
    console.error("Lỗi khi xác nhận OTP:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi khi xác nhận OTP" });
  }
}

async function loginUser(req, res) {
  const { gmail, matKhau } = req.body;
  try {
    const user = await UserModel.findOne({ gmail });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Tài khoản chưa được xác nhận" });
    }

    const check = await comparePassword(matKhau, user.matKhau);
    if (!check) {
      return res.status(400).json({ message: "Mật khẩu không đúng" });
    }

    const token = generateToken(user._id, user.role);
    return res.json({ message: "Đăng nhập thành công", token });
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi khi đăng nhập" });
  }
}

async function ForgotPassword(req, res) {
  const { gmail } = req.body;

  try {
    const user = await UserModel.findOne({ gmail });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Tạo mã OTP 6 chữ số
    const otpExpiry = Date.now() + 15 * 60 * 1000; // OTP hết hạn sau 15 phút

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: gmail,
      subject: "Xác nhận khôi phục mật khẩu",
      text: `Chào ${user.tenNguoiDung},\n\nVui lòng sử dụng mã OTP sau để xác nhận khôi phục mật khẩu của bạn:\n\n${otp}\n\nTrân trọng,\nĐội ngũ hỗ trợ`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Lỗi khi gửi email:", error);
      } else {
        console.log("Email đã được gửi:", info.response);
      }
    });

    return res.json({
      message: "OTP khôi phục mật khẩu đã được gửi, vui lòng kiểm tra email",
    });
  } catch (error) {
    console.error("Lỗi khi gửi OTP khôi phục mật khẩu:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi khi gửi OTP" });
  }
}

async function ResetPassword(req, res) {
  const { gmail, matKhauMoi } = req.body;

  try {
    const user = await UserModel.findOne({ gmail });

    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }

    const hash_pass = await hashPassword(matKhauMoi);
    user.matKhau = hash_pass;
    await user.save();

    return res.json({
      message: "Mật khẩu đã được cập nhật thành công",
    });
  } catch (error) {
    console.error("Lỗi khi đặt lại mật khẩu:", error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi đặt lại mật khẩu" });
  }
}

async function showUserById(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Thiếu thông tin userId" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi lấy thông tin người dùng" });
  }
}

async function ResendOTP(req, res) {
  const { gmail } = req.body;

  try {
    const user = await UserModel.findOne({ gmail });

    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Tài khoản đã được xác nhận" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Tạo mã OTP 6 chữ số
    const otpExpiry = Date.now() + 15 * 60 * 1000; // OTP hết hạn sau 15 phút

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: gmail,
      subject: "Xác nhận mã OTP mới",
      text: `Chào ${user.tenNguoiDung},\n\nVui lòng sử dụng mã OTP sau để xác nhận tài khoản của bạn:\n\n${otp}\n\nTrân trọng,\nĐội ngũ hỗ trợ`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Lỗi khi gửi email:", error);
        return res.status(500).json({ message: "Lỗi khi gửi lại mã OTP" });
      } else {
        console.log("Email đã được gửi:", info.response);
        return res.json({
          message: "Mã OTP mới đã được gửi, vui lòng kiểm tra email",
        });
      }
    });
  } catch (error) {
    console.error("Lỗi khi gửi lại mã OTP:", error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi gửi lại mã OTP" });
  }
}

const multer = require("multer");
const { upload } = require("../untils/index");

async function createAnhDaiDien(req, res, next) {
  try {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        // Handle file upload errors
        console.error(err);
        return res.status(500).json({ message: "Error uploading file" });
      }

      const { IDNguoiDung } = req.params;
      if (!IDNguoiDung || !req.file) {
        return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
      }

      const newPath = req.file.path.replace("public", process.env.URL_IMAGE);
      try {
        const updateNguoiDung = await UserModel.findOneAndUpdate(
          { _id: IDNguoiDung },
          { anhDaiDien: newPath },
          { new: true }
        );

        res.status(201).json({ message: "Đổi ảnh đại diện thành công" });
      } catch (error) {
        console.error("Lỗi khi Sửa ảnh đại diện:", error);
        // Xử lý lỗi cụ thể của Mongoose (ví dụ: ValidationError, DuplicateKeyError)
        res.status(500).json({ message: "Lỗi server", error });
      }
    });
  } catch (error) {
    console.error("Lỗi chung:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
}

// async function updateUser(req, res, next) {
//   // const { ThuocTinhID } = req.params;
//   const { tenNguoiDung,UserID,LoaiThongTinUpdate } = req.body;

//   try {
//       const updatedThuocTinh = await UserModel.findByIdAndUpdate(
//           { UserID },
//           { tenNguoiDung:tenNguoiDung},
//           { new: true }
//       );

//       if (!updatedThuocTinh) {
//           return res.status(404).json({ message: 'Không tìm thấy thuộc tính' });
//       }

//       res.status(200).json(updatedThuocTinh);
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Lỗi khi cập nhật thuộc tính' });
//   }
// }

async function updateUser(req, res, next) {
  const { UserID, LoaiThongTinUpdate } = req.body;

  // Tạo một object để lưu trữ các trường cần cập nhật
  const updateData = {};
  updateData[LoaiThongTinUpdate] = req.body[LoaiThongTinUpdate];
  console.log(updateData);
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(UserID, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng", updatedUser });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi cập nhật người dùng" });
  }
}
async function updateUserDiaChi(req, res, next) {
  const { UserID, diaChiMoi } = req.body;

  // Tạo một object để lưu trữ các trường cần cập nhật
  console.log(diaChiMoi);
  try {
    const user = await UserModel.findById(UserID);
    if (!user) {
      return "Người dùng không tồn tại";
    }

    user.diaChi = diaChiMoi;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi cập nhật người dùng" });
  }
}
module.exports = {
  RegisterUser,
  VerifyOTP,
  loginUser,
  ForgotPassword,
  ResetPassword,
  createAnhDaiDien,
  showUserById,
  updateUser,
  updateUserDiaChi,
  ResendOTP,
};
