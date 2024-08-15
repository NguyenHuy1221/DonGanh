const GioHang = require("../models/GioHangSchema");

async function createGioHang(req, res, next) {
  try {
    const { userId, chiTietGioHang } = req.body;

    let gioHang = await GioHang.findOne({ userId });

    if (!gioHang) {
      gioHang = new GioHang({
        userId,
        chiTietGioHang,
      });
    } else {
      chiTietGioHang.forEach((newProduct) => {
        const existingProduct = gioHang.chiTietGioHang.find(
          (item) =>
            item.idBienThe.toString() === newProduct.idBienThe.toString()
        );

        if (existingProduct) {
          existingProduct.soLuong += newProduct.soLuong;
          existingProduct.donGia += newProduct.donGia;
        } else {
          gioHang.chiTietGioHang.push(newProduct);
        }
      });
    }

    const savedGioHang = await gioHang.save();
    res.status(201).json(savedGioHang);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tạo hoặc cập nhật giỏ hàng" });
  }
}

async function getGioHangById(req, res, next) {
  try {
    const gioHang = await GioHang.findById(req.params.id)
      .populate("userId")
      .populate("chiTietGioHang.idBienThe");
    if (!gioHang) {
      return res.status(404).json({ error: "Giỏ hàng không tồn tại" });
    }
    res.status(200).json(gioHang);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin giỏ hàng" });
  }
}

async function updateGioHang(req, res, next) {
  try {
    const { chiTietGioHang } = req.body;

    const gioHang = await GioHang.findById(req.params.id);
    if (!gioHang) {
      return res.status(404).json({ error: "Giỏ hàng không tồn tại" });
    }

    chiTietGioHang.forEach((updatedProduct) => {
      const existingProduct = gioHang.chiTietGioHang.find(
        (item) =>
          item.idBienThe.toString() === updatedProduct.idBienThe.toString()
      );

      if (existingProduct) {
        existingProduct.soLuong = updatedProduct.soLuong;
        existingProduct.donGia = updatedProduct.donGia;
      } else {
        gioHang.chiTietGioHang.push(updatedProduct);
      }
    });

    const updatedGioHang = await gioHang.save();
    res.status(200).json(updatedGioHang);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi cập nhật giỏ hàng" });
  }
}

async function deleteGioHang(req, res, next) {
  try {
    const { idBienThe } = req.body;

    const gioHang = await GioHang.findById(req.params.id);
    if (!gioHang) {
      return res.status(404).json({ error: "Giỏ hàng không tồn tại" });
    }

    const productIndex = gioHang.chiTietGioHang.findIndex(
      (item) => item.idBienThe.toString() === idBienThe.toString()
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ error: "Sản phẩm không tồn tại trong giỏ hàng" });
    }

    gioHang.chiTietGioHang.splice(productIndex, 1);

    const updatedGioHang = await gioHang.save();
    res.status(200).json(updatedGioHang);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa sản phẩm khỏi giỏ hàng" });
  }
}

module.exports = {
  createGioHang,
  getGioHangById,
  updateGioHang,
  deleteGioHang,
};
