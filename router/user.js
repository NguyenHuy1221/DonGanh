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
} = require("../controller/user-controller");

// register user
userRoute.post("/register", async function (req, res) {
  return RegisterUser(req, res);
});

// otp
userRoute.post("/verifyOtp", async function (req, res) {
  return VerifyOTP(req, res);
});

// register user
userRoute.get("/login", async function (req, res) {
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
userRoute.post("/createAnhDaiDien", async function (req, res) {
  return createAnhDaiDien(req, res);
});

module.exports = userRoute;
