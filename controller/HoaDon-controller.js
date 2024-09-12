const HoaDonModel = require("../models/HoaDonSchema");
const GioHangModel = require("../models/GioHangSchema")
const UserModel = require("../models/NguoiDungSchema")
require("dotenv").config();
// qr
// const PayOS = require('@payos/node')
// const pauos = require('client_oid','api_key','checksum-key')

// async function CreateThanhToan(req, res, next) {
//   const order = {
//     amount: 10000,
//     description: 'thanh toan nong san',
//     ordercode : 10,
//     returnUrl: `${YOUR_DOMAIN}/success.html`,
//     cancelUrl: `${YOUR_DOMAIN}/cancel.html`
//   }
// }
 






//ham lay danh sach thuoc tinh
async function getlistHoaDon(req, res, next) {

    try {
        const HoaDon = await HoaDonModel.find();
        res.status(200).json(HoaDon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi tìm kiếm thuộc tính' });
    }
}
async function getHoaDonById(req, res) {
    try {
      const { hoadonId } = req.params;
  
      if (!hoadonId) {
        return res.status(400).json({ message: "Thiếu thông tin hoadonId" });
      }
  
      const hoadon = await HoaDonModel.findById(hoadonId).populate("userId")
      .populate('khuyenmaiId')
      .populate('transactionId')
      // .populate({
      //   path: 'chiTietHoaDon.idBienThe',
      //   model: 'BienThe' // Tên model của BienThe
      // });
  
      if (!hoadon) {
        return res.status(404).json({ message: "Không tìm thấy hoa don" });
      }
  
      return res.json(hoadon);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      return res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi lấy thông tin người dùng" });
    }
  }

  async function createUserDiaChivaThongTinGiaoHang(req, res, next) {
    const { userId, diaChiMoi,ghiChu,khuyenmaiId,giohangId,TongTien } = req.body;
    // Tạo một object để lưu trữ các trường cần cập nhật
    const TrangThai = 0
    try {
        // const giohang = await GioHangModel.findById(giohangId).populate({ path: 'chiTietGioHang.idBienThe', model: 'BienThe' });
        const giohang = await GioHangModel.findById(giohangId)
    .populate({
        path: 'chiTietGioHang.idBienThe',
        model: 'BienThe',
        populate: {
            path: 'KetHopThuocTinh.IDGiaTriThuocTinh',
            model: 'GiaTriThuocTinh',
            populate: {
              path: 'ThuocTinhID',
              model: 'ThuocTinh'
          }
        }
    }).exec();
      const user = await UserModel.findById(userId);
      if (!user) {
        return 'Người dùng không tồn tại';
      }
      console.log(giohang.chiTietGioHang)
// Chuyển đổi dữ liệu chiTietGioHang
const chiTietHoaDon = giohang.chiTietGioHang.map(item => ({
  BienThe: {
      sku: item.idBienThe.sku,
      gia: item.idBienThe.gia,
      soLuong: item.idBienThe.soLuong,
      KetHopThuocTinh: item.idBienThe.KetHopThuocTinh.map(ketHop => ({
          GiaTriThuocTinh: {
              ThuocTinh: {
                  TenThuocTinh: ketHop.IDGiaTriThuocTinh.ThuocTinhID.TenThuocTinh
              },
              GiaTri: ketHop.IDGiaTriThuocTinh.GiaTri
          }
      }))
  },
  soLuong: item.soLuong,
  donGia: item.donGia
}));
      user.diaChi = diaChiMoi;
      await user.save();
      const newHoaDon = new HoaDonModel({
        userId,
        diaChi:diaChiMoi,
        TrangThai,
        TongTien,
        chiTietHoaDon: chiTietHoaDon,
        GhiChu: ghiChu,
    });
    // Lưu đối tượng vào cơ sở dữ liệu
    const savedHoaDon = await newHoaDon.save();
      res.status(200).json(savedHoaDon);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi khi Tạo Đơn Hàng' });
    }
  }
async function updateHoaDonThanhToan(req, res, next) {
    const { hoadonId, transactionId } = req.body;
  
    try {
      const hoadon = await HoaDonModel.findById(hoadonId);
      if (!hoadon) {
        return 'hoa don không tồn tại';
      }
  
      hoadon.transactionId = transactionId;
      await hoadon.save();
  
      res.status(200).json(hoadon);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi khi cập nhật hoa don' });
    }
  }

//hàm thêm thuộc tính
async function createThuocTinh(req, res, next) {
    const { ThuocTinhID, TenThuocTinh } = req.body;
    try {

        // Kiểm tra xem ThuocTinhID đã tồn tại chưa
    const existingThuocTinh = await ThuocTinhModel.findOne({ ThuocTinhID });

    if (existingThuocTinh) {
        return res.status(409).json({ message: 'Thuộc tính đã tồn tại' });
    }
        // Tạo một đối tượng thuộc tính mới dựa trên dữ liệu nhận được
        const newThuocTinh = new ThuocTinhModel({
            ThuocTinhID,
            TenThuocTinh
        });
        
        // Lưu đối tượng vào cơ sở dữ liệu
        const savedThuocTinh = await newThuocTinh.save();

        // Trả về kết quả cho client
        res.status(201).json(savedThuocTinh);
    } catch (error) {
        if (error.code === 11000) {
            console.error('ThuocTinhID đã tồn tại');
          } else {
            console.error('Lỗi khác:', error);
          }
    }
}
  
   
async function updateThuocTinh(req, res, next) {
    // const { ThuocTinhID } = req.params;
    const { TenThuocTinh,ThuocTinhID } = req.body;

    try {
        const updatedThuocTinh = await ThuocTinhModel.findOneAndUpdate(
            { ThuocTinhID },
            { TenThuocTinh },
            { new: true }
        );

        if (!updatedThuocTinh) {
            return res.status(404).json({ message: 'Không tìm thấy thuộc tính' });
        }

        res.status(200).json(updatedThuocTinh);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật thuộc tính' });
    }
}

async function deleteThuocTinh(req, res, next) {
    const { ThuocTinhID } = req.params;

    try {
        const deletedThuocTinh = await ThuocTinhModel.findOneAndDelete( ThuocTinhID );

        if (!deletedThuocTinh) {
            return res.status(404).json({ message: 'Không tìm thấy thuộc tính' });
        }

        res.status(200).json({ message: 'Xóa thuộc tính thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa thuộc tính' });
    }
}

async function findThuocTinh(req, res, next) {
    const { ThuocTinhID, TenThuocTinh } = req.body;

    let query = {};
    if (ThuocTinhID) {
        query.ThuocTinhID = ThuocTinhID;
    }
    if (TenThuocTinh) {
        query.TenThuocTinh = { $regex: TenThuocTinh, $options: 'i' }; // Tìm kiếm không phân biệt hoa thường
    }

    try {
        const thuocTinhs = await ThuocTinhModel.find(query);
        res.status(200).json(thuocTinhs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi tìm kiếm thuộc tính' });
    }
}



module.exports = {
    getlistHoaDon,
    getHoaDonById,
    createThuocTinh,
    updateThuocTinh,
    deleteThuocTinh,
    findThuocTinh,
    createUserDiaChivaThongTinGiaoHang,
    updateHoaDonThanhToan,
};
