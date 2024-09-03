const express = require("express");
const sanphamRouter = express.Router();
const {
  getlistSanPham,
  createSanPham,
  createThuocTinhSanPham,
  createSanPhamVoiBienThe,
  getlistBienTheFake,
  createBienTheFake,
  updateSanPham,
  deleteSanPham,
  findSanPham,
  getlistPageSanPham,
  // createimageSanPham,
  // updateimageSanPham,
  // deleteImageSanPham,
  findSanPhambyID,
  getlistBienTheInSanPham,
  findSanPhamByDanhMuc,
} = require("../controller/sanpham-controller");

sanphamRouter.get("/getlistSanPham", async function (req, res) {
  return getlistSanPham(req, res);
});

sanphamRouter.post("/createSanPham", async function (req, res) {
  return createSanPham(req, res);
});

sanphamRouter.post("/createThuocTinhSanPham", async function (req, res) {
  return createThuocTinhSanPham(req, res);
});
sanphamRouter.post("/createbienthesanpham", async function (req, res) {
  return createbienthesanpham(req, res);
});

sanphamRouter.post("/createSanPhamVoiBienThe", async function (req, res) {
  return createSanPhamVoiBienThe(req, res);
});

sanphamRouter.get("/getlistBienTheFake", async function (req, res) {
  return getlistBienTheFake(req, res);
});
sanphamRouter.post("/createBienTheFake", async function (req, res) {
  return createBienTheFake(req, res);
});

sanphamRouter.put("/updateReview", async function (req, res) {
  return updateReview(req, res);
});
sanphamRouter.delete("/deleteReview", async function (req, res) {
  return DeleteReview(req, res);
});

sanphamRouter.get("/getlistPageSanPham", async function (req, res) {
  return getlistPageSanPham(req, res);
});

// sanphamRouter.put("/createimageSanPham", async function (req, res) {
//   return createimageSanPham(req, res);
// });
// sanphamRouter.put("/updateimageSanPham", async function (req, res) {
//   return updateimageSanPham(req, res);
// });
// sanphamRouter.delete("/deleteImageSanPham", async function (req, res) {
//   return deleteImageSanPham(req, res);
// });
sanphamRouter.get("/findSanPhambyID:IDSanPham", async function (req, res) {
  return findSanPhambyID(req, res);
});
sanphamRouter.get(
  "/getlistBienTheInSanPham:IDSanPham",
  async function (req, res) {
    return getlistBienTheInSanPham(req, res);
  }
);
sanphamRouter.get("/getlistPageSanPham", async function (req, res) {
  return getlistPageSanPham(req, res);
});

// sanphamRouter.put("/createimageSanPham", async function (req, res) {
//   return createimageSanPham(req, res);
// });
// sanphamRouter.put("/updateimageSanPham", async function (req, res) {
//   return updateimageSanPham(req, res);
// });
// sanphamRouter.delete("/deleteImageSanPham", async function (req, res) {
//   return deleteImageSanPham(req, res);
// });

sanphamRouter.get("/findSanPhambyID", async function (req, res) {
  return findSanPhambyID(req, res);
});
sanphamRouter.put("/createimageSanPham", async function (req, res) {
  return createimageSanPham(req, res);
});
sanphamRouter.put("/updateimageSanPham", async function (req, res) {
  return updateimageSanPham(req, res);
});
sanphamRouter.delete("/deleteImageSanPham", async function (req, res) {
  return deleteImageSanPham(req, res);
});
sanphamRouter.get("/findSanPhambyID/:IDSanPham", async function (req, res) {
  return findSanPhambyID(req, res);
});

sanphamRouter.get("/findSanPham/:IDDanhMuc", async function (req, res) {
  return findSanPhamByDanhMuc(req, res);
});

module.exports = sanphamRouter;
