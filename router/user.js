const express = require("express");
const userRoute = express.Router();
const UserModel = require("../models/NguoiDungSchema");

const {
  RegisterUser,
  loginUser,
  VerifyOTP,
  ForgotPassword,
  ResetPassword,
  createAnhDaiDien,
  showUserById,
  updateUser,
  updateUserDiaChi,
  ResendOTP,
} = require("../controller/user-controller");

// show user
userRoute.get("/showUserID/:userId", function (req, res) {
  return showUserById(req, res);
});

// register user
userRoute.post("/register", async function (req, res) {
  return RegisterUser(req, res);
});

userRoute.post("/resendOTP", async function (req, res) {
  return ResendOTP(req, res);
});

// otp
userRoute.post("/verifyOtp", async function (req, res) {
  return VerifyOTP(req, res);
});

// register user
userRoute.post("/login", async function (req, res) {
  return loginUser(req, res);
});

// forgot password
userRoute.post("/forgotPassword", async function (req, res) {
  return ForgotPassword(req, res);
});

// reset password
userRoute.post("/resetPassword", async function (req, res) {
  return ResetPassword(req, res);
});

//update image user
userRoute.post("/createAnhDaiDien/:IDNguoiDung", async function (req, res) {
  return createAnhDaiDien(req, res);
});

userRoute.put("/updateUser", async function (req, res) {
  return updateUser(req, res);
});

// });
userRoute.put("/updateUserDiaChi", async function (req, res) {
  return updateUserDiaChi(req, res);
});

module.exports = userRoute;
