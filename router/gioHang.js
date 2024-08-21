const express = require("express");
const gioHangRouter = express.Router();

const {
  createGioHang,
  getGioHangById,
  updateGioHang,
  deleteGioHang,
  zaloPay,
} = require("../controller/GioHang-controller");

gioHangRouter.post("/gioHang", async function (req, res) {
  return createGioHang(req, res);
});

gioHangRouter.get("/gioHang/:id", async function (req, res) {
  return getGioHangById(req, res);
});

gioHangRouter.put("/gioHang/:id", async function (req, res) {
  return updateGioHang(req, res);
});

gioHangRouter.delete("/gioHang/:id", async function (req, res) {
  return deleteGioHang(req, res);
});

gioHangRouter.post("/payment/:id", async function (req, res) {
  return zaloPay(req, res);
});

module.exports = gioHangRouter;
