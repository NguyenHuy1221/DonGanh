const express = require("express");
const userRoute = express.Router();
const UserModel = require("../models/NguoiDungSchema");

const { RegisterUser } = require("../controller/user-controller");

// register user
userRoute.post("/register", async function (req, res) {
  return RegisterUser(req, res);
});

module.exports = userRoute;
