const HoaDonModel = require("../models/HoaDonSchema");
const GioHangModel = require("../models/GioHangSchema")
const UserModel = require("../models/NguoiDungSchema")
const moment = require('moment-timezone');
require("dotenv").config();
const axios = require('axios');
const { refreshToken } = require('../jwt/index');

//xoa dau tieng viet 
const removeAccents = require('remove-accents');
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
async function getHoaDonByUserId(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Thiếu thông tin userid" });
    }

    const hoadon = await HoaDonModel.find({userId:userId}).populate("userId")
    .populate('khuyenmaiId')
    .populate('transactionId')
    // .populate({
    //   path: 'chiTietHoaDon.BienThe.IDSanPham',
    //   model: 'SanPham',
    // })
    .exec();
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

async function getHoaDonByHoaDonId(req, res) {
    try {
      const { hoadonId } = req.params;
  
      if (!hoadonId) {
        return res.status(400).json({ message: "Thiếu thông tin userid" });
      }
  
      const hoadon = await HoaDonModel.findById(hoadonId).populate("userId")
      .populate('khuyenmaiId')
      .populate('transactionId')
      // .populate({
      //   path: 'chiTietHoaDon.BienThe.IDSanPham',
      //   model: 'SanPham',
      // })
      .exec();
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
    const { userId, diaChiMoi,ghiChu,khuyenmaiId,ChiTietGioHang,YeuCauNhanHang,giohangId,TongTien,transactionId } = req.body;
    console.log(ChiTietGioHang,YeuCauNhanHang)
    console.log(diaChiMoi,ghiChu,khuyenmaiId,giohangId,TongTien,transactionId)
const vietnamTime = moment().tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss');
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
      const orderId = `${user.tenNguoiDung}-${vietnamTime}`;
      if (!user) {
        return 'Người dùng không tồn tại';
      }
      console.log(giohang.chiTietGioHang)
// Chuyển đổi dữ liệu chiTietGioHang
const chiTietHoaDon = giohang.chiTietGioHang.map(item => ({
  
  BienThe: {
      IDSanPham: item.idBienThe.IDSanPham,
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

const orderData = {
  mrc_order_id: orderId,
  total_amount: TongTien,
  description: ghiChu,
  url_success: "https://baokim.vn/",
  merchant_id: parseInt(process.env.MERCHANT_ID),
  url_detail: "https://baokim.vn/",
  lang: "en",
  bpm_id: transactionId,
  webhooks: "https://baokim.vn/",
  customer_email: user.gmail,
  customer_phone: "0358748103",
  customer_name: "ho duc hau",
  customer_address: diaChiMoi.tinhThanhPho+" "+diaChiMoi.quanHuyen+" "+diaChiMoi.phuongXa+" "+diaChiMoi.duongThon,
  items: JSON.stringify(chiTietHoaDon.map(item => ({
    item_id: item.BienThe.IDSanPham,
    item_code: item.BienThe.sku,
    item_name: item.BienThe.TenSanPham,
    price_amount: item.BienThe.gia,
    quantity: item.soLuong,
    url: process.env.BASE_URL + item.BienThe.IDSanPham,
  }))),
  // extension: {
  //   items: chiTietHoaDon.map(item => ({
  //     item_id: item.BienThe.IDSanPham,
  //     item_code: item.BienThe.sku,
  //     item_name: item.BienThe.TenSanPham,
  //     price_amount: item.BienThe.gia,
  //     quantity: item.soLuong,
  //     url: process.env.BASE_URL + item.BienThe.IDSanPham,
  //   })),
  // },
};
console.log(orderData)
console.log(removeAccents(user.tenNguoiDung))
const orderResponse = await createOrder(orderData);
console.log(orderResponse.data.payment_url,orderResponse.data.redirect_url,orderResponse.data.order_id)
      // user.diaChi = diaChiMoi;
      // await user.save();
      const newHoaDon = new HoaDonModel({
        userId,
        orderId: orderId,
        diaChi:diaChiMoi,
        TrangThai,
        TongTien,
        khuyenmaiId,
        transactionId : transactionId,
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

  async function createOrder(orderData) {
    try {
      // Tách riêng việc tạo token
      const token = refreshToken();
      const response = await axios.post(process.env.API_URL_createOrder, orderData, {
        params: {
          jwt: token
      },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      let errorMessage = 'Error creating order';
      if (error.response) {
        errorMessage = error.response.data.message || error.response.statusText;
      }
      throw new Error(errorMessage);
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



  async function Checkdonhangbaokim(req, res, next) {

  const orderId = req.params;
  console.log(orderId)
  const order = await HoaDonModel.findById(orderId); // Lấy thông tin đơn hàng từ DB
  const token = refreshToken();
  // Kiểm tra thời gian hết hạn của đơn hàng
  // if (new Date() > order.expiresAt) {
  //   return res.status(400).json({ message: 'Đơn hàng đã hết hạn' });
  // }

  // Nếu đơn hàng còn hạn, kiểm tra trạng thái với API của Bảo Kim
  try {
    const checkResult = getCheckOrder(token,order.order_id,order.mrc_order_id);
    res.status(200).json(checkResult);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi kiểm tra đơn hàng', error: error.message });
  }
  }



  async function getCheckOrder(token,orderid,mrc_order_id) {
    
    try {
        const response = await axios.get(process.env.API_URL_getCheckOrder, {
            params: {
                jwt: token,
                id: orderid	,
                mrc_order_id :mrc_order_id,
            }
        });
        return response.data;
    } catch (error) {
        return 'Error  check Order methods:', error;
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
    getHoaDonByUserId,
    getHoaDonByHoaDonId,
    createThuocTinh,
    updateThuocTinh,
    deleteThuocTinh,
    findThuocTinh,
    createUserDiaChivaThongTinGiaoHang,
    updateHoaDonThanhToan,
    Checkdonhangbaokim,
};
