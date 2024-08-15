const GioHang = require("../models/GioHangSchema");

async function createGioHang(req, res, next) {
  try {
    const { userId, chiTietGioHang } = req.body;

    const updatedChiTietGioHang = chiTietGioHang.map((item) => ({
      ...item,
      tongTien: item.soLuong * item.donGia,
    }));

    const newGioHang = new GioHang({
      userId,
      chiTietGioHang: updatedChiTietGioHang,
    });

    const savedGioHang = await newGioHang.save();
    res.status(201).json(savedGioHang);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tạo giỏ hàng mới" });
  }
}

async function getGioHangById(req, res, next) {
  try {
    // const gioHang = await GioHang.findById(req.params.id).populate("userId");
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
    const updatedGioHang = await GioHang.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedGioHang) {
      return res.status(404).json({ error: "Giỏ hàng không tồn tại" });
    }
    res.status(200).json(updatedGioHang);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi cập nhật giỏ hàng" });
  }
}

async function deleteGioHang(req, res, next) {
  try {
    const deletedGioHang = await GioHang.findByIdAndDelete(req.params.id);
    if (!deletedGioHang) {
      return res.status(404).json({ error: "Giỏ hàng không tồn tại" });
    }
    res.status(200).json({ message: "Giỏ hàng đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi xóa giỏ hàng" });
  }
}

module.exports = {
  createGioHang,
  getGioHangById,
  updateGioHang,
  deleteGioHang,
};
