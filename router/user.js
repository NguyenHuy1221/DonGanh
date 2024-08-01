const express = require("express");
const userRoute = express.Router();
const UserModel = require("../models/NguoiDungSchema");

const { RegisterUser, loginUser } = require("../controller/user-controller");

// register user
userRoute.post("/register", async function (req, res) {
  return RegisterUser(req, res);
});

// register user
userRoute.get("/login", async function (req, res) {
  return loginUser(req, res);
});

module.exports = userRoute;
