const express = require("express");
const apiRoute = express.Router();
const thuoctinhRouter = require("../router/thuoctinh");
const thuoctinhgiatriRouter = require("../router/thuoctinhgiatri");
const sanphamRouter = require("../router/sanpham");
const danhmucRoute = require("../router/danhmuc");
const userRoute = require("../router/user");
const gioHangRoute = require("../router/gioHang");
const bannerRoutes = require("../router/banner");
const bientheRoute = require("../router/bienthe");
const hoadonRoute = require("../router/hoadon")

apiRoute.use("/user", userRoute);
apiRoute.use("/cart", gioHangRoute);
apiRoute.use("/banner", bannerRoutes);

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
    console.log("call danh muc  api router");
    next();
  },
  danhmucRoute
);
apiRoute.use(
  "/bienthe",
  (req, res, next) => {
    console.log("call bien the api router");
    next();
  },
  bientheRoute
);
apiRoute.use(
  "/hoadon",
  (req, res, next) => {
    console.log("call hoadon api router");
    next();
  },
  hoadonRoute
);
module.exports = apiRoute;
