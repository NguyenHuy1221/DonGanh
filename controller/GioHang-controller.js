const GioHang = require("../models/GioHangSchema");
const QRCode = require("qrcode");
const axios = require("axios").default;
const CryptoJS = require("crypto-js");
const moment = require("moment");
const Transaction = require("../models/TransactionSchema");

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

const config = {
  app_id: "2554",
  key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
  key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

async function zaloPay(req, res, next) {
  try {
    const { id } = req.params;
    const gioHang = await GioHang.findById(id);

    if (!gioHang) {
      return res.status(404).json({ error: "Giỏ hàng không tồn tại" });
    }

    const items = gioHang.chiTietGioHang.map((item) => ({
      itemid: item.idBienThe.toString(),
      itemname: item.tenSanPham,
      itemprice: item.donGia,
      itemquantity: item.soLuong,
    }));

    const transID = Math.floor(Math.random() * 1000000);
    const embed_data = {
      redirecturl: "https://pcrender.com",
    };
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
      app_user: "user123",
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: gioHang.chiTietGioHang.reduce(
        (acc, item) => acc + item.soLuong * item.donGia,
        0
      ),
      description: `Thanh toán  #${transID}`,
      bank_code: "zalopayapp",
    };

    const data =
      config.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const response = await axios.post(config.endpoint, null, { params: order });

    if (response.data.return_code === 1) {
      // Kiểm tra nếu giao dịch thành công
      const transaction = new Transaction({
        transactionId: response.data.zptranstoken || transID, // Gán transactionId từ phản hồi của ZaloPay hoặc tự tạo nếu không có
        orderId: id,
        amount: order.amount,
        status: "success",
        method: "ZaloPay",
        timestamp: new Date(),
      });

      await transaction.save(); // Lưu giao dịch vào cơ sở dữ liệu
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Lỗi khi xử lý thanh toán ZaloPay:", error);
    res.status(500).json({ error: "Lỗi khi xử lý thanh toán ZaloPay" });
  }
}

module.exports = {
  createGioHang,
  getGioHangById,
  updateGioHang,
  deleteGioHang,
  zaloPay,
};
