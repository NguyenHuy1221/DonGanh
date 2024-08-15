const express = require("express");
const apiRoute = express.Router();
const thuoctinhRouter = require("../router/thuoctinh");
const thuoctinhgiatriRouter = require("../router/thuoctinhgiatri");
const sanphamRouter = require("../router/sanpham");
const danhmucRoute = require("../router/danhmuc");
const userRoute = require("../router/user");
const gioHangRoute = require("../router/gioHang");

apiRoute.use("/user", userRoute);
apiRoute.use("/cart", gioHangRoute);

apiRoute.use(
  "/sanpham",
  (req, res, next) => {
    console.log("call san pham api router");
    next();
  },
  sanphamRouter
);

apiRoute.use(
  "/thuoctinh",
  (req, res, next) => {
    console.log("call thuoc tinh api router");
    next();
  },
  thuoctinhRouter
);

apiRoute.use(
  "/thuoctinhgiatri",
  (req, res, next) => {
    console.log("call thuoc tinh gia tri api router");
    next();
  },
  thuoctinhgiatriRouter
);

apiRoute.use(
  "/danhmuc",
  (req, res, next) => {
    console.log("call danh muc gia tri api router");
    next();
  },
  danhmucRoute
);
module.exports = apiRoute;
