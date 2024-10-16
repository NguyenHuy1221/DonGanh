const SanPhamModel = require("../models/SanPhamSchema");
const ThuocTinhModel = require("../models/ThuocTinhSchema");
const ThuocTinhGiaTriModel = require("../models/GiaTriThuocTinhSchema");
const BienTheSchema = require("../models/BienTheSchema");
const mongoose = require("mongoose");

const fs = require('fs');
const path = require('path');


require("dotenv").config();
const multer = require("multer");
const util = require('util');
const { v4: uid } = require('uuid');
// const { upload } = require("../untils/index");
//ham lay danh sach thuoc tinh
async function getlistSanPham(req, res, next) {
  try {
    const sanphams = await SanPhamModel.find();
    res.status(200).json(sanphams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi truy xuat san pham" });
  }
}

async function toggleSanPhamMoi(req, res, next) {
  const { IDSanPham } = req.params;
  try {
    const sanPham = await SanPhamModel.findById(IDSanPham);
    if (!sanPham) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    // Đổi trạng thái SanPhamMoi
    sanPham.SanPhamMoi = !sanPham.SanPhamMoi;
    await sanPham.save();
    res.status(200).json({ message: `Trạng thái SanPhamMoi đã được đổi thành ${sanPham.SanPhamMoi}` });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái SanPhamMoi:", error);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
}

async function getSanPhamListNew_Old(req, res, next) {
  const { SanPhamMoi } = req.query;

  try {
    // Kiểm tra giá trị của SanPhamMoi
    // if (typeof SanPhamMoi !== 'boolean') {
    //   return res.status(400).json({ message: 'Giá trị SanPhamMoi phải là boolean' });
    // }

    // Lấy danh sách sản phẩm dựa trên giá trị SanPhamMoi
    const sanPhamList = await SanPhamModel.find({ SanPhamMoi });

    res.status(200).json(sanPhamList);
  } catch (error) {
    console.error("Lỗi lấy danh sách sản phẩm:", error);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
}
// Cấu hình Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    console.log(file);
    const id = uid();
    const ext = path.extname(file.originalname).toLowerCase();
    const newFilename = `${id}-${file.originalname.replace(ext, '.jpg')}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });
const uploadFields = util.promisify(upload.fields([{ name: 'file', maxCount: 1 }, { name: 'files', maxCount: 10 }]));

async function createSanPham(req, res, next) {
  
  try {
    // Xử lý tệp chính và các tệp bổ sung
    await uploadFields(req, res);

    if (!req.files['file'] || !req.files['file'][0]) {
      return res.status(400).json({ message: 'File is required' });
    }

    const newPath = req.files['file'][0].path.replace("public", process.env.URL_IMAGE);

    const hinhBoSung = req.files['files'] ? req.files['files'].map(file => ({
      TenAnh: file.originalname,
      UrlAnh: file.path.replace("public", process.env.URL_IMAGE),
    })) : [];
    const {
      IDSanPham,
      TenSanPham,
      DonGiaNhap,
      DonGiaBan,
      SoLuongNhap,
      SoLuongHienTai,
      PhanTramGiamGia,
      TinhTrang,
      MoTa,
      Unit,
      DanhSachThuocTinh,
      IDDanhMuc,
      IDDanhMucCon,
    } = req.body;
    console.log(IDSanPham,
      TenSanPham,
      DonGiaNhap,
      DonGiaBan,
      SoLuongNhap,
      SoLuongHienTai,
      PhanTramGiamGia,
      TinhTrang,
      MoTa,
      Unit,
      DanhSachThuocTinh,
      IDDanhMuc,
      IDDanhMucCon,)
    //  const IDSanPham = "dddd"
    //  const TenSanPham="numberone"
    //  const DonGiaNhap=12313
    //  const DonGiaBan=12313
    //  const SoLuongNhap=3444
    //  const SoLuongHienTai=3333
    //  const PhanTramGiamGia=11
    //  const TinhTrang=1
    //  const MoTa="aaa"
    //  const Unit=2
    //  const DanhSachThuocTinh= []
    //  const IDDanhMuc="adwwdadw"
    //  const IDDanhMucCon="fewfesfsef"
    // Kiểm tra nếu IDSanPham không được cung cấp hoặc là null
    if (!IDSanPham) {
      return res.status(400).json({ message: 'IDSanPham is required and cannot be null' });
    }
  
console.log(newPath,hinhBoSung)
      const newSanPham = new SanPhamModel({
         IDSanPham,
        TenSanPham,
        HinhSanPham: newPath,
        DonGiaNhap,
        DonGiaBan,
        SoLuongNhap,
        SoLuongHienTai,
        PhanTramGiamGia,
        TinhTrang,
        MoTa,
        Unit,
        HinhBoSung: hinhBoSung,
        DanhSachThuocTinh: DanhSachThuocTinh,
        IDDanhMuc,
        IDDanhMucCon,
      });

      // Lưu đối tượng vào cơ sở dữ liệu
      const savedSanPham = await newSanPham.save();
      res.status(201).json(savedSanPham);
  } catch (error) {
    console.error("Lỗi Them san pham bổ sung:", error);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
}


async function createSanPhamtest(req, res, next) {
  const {
    IDSanPham,
    TenSanPham,
    DonGiaNhap,
    DonGiaBan,
    SoLuongNhap,
    SoLuongHienTai,
    PhanTramGiamGia,
    TinhTrang,
    MoTa,
    Unit,
    DanhSachThuocTinh,
    IDDanhMuc,
    IDDanhMucCon,
  } = req.body;
 console.log(IDSanPham,
  TenSanPham,
  DonGiaNhap,
  DonGiaBan,
  SoLuongNhap,
  SoLuongHienTai,
  PhanTramGiamGia,
  TinhTrang,
  MoTa,
  Unit,
  DanhSachThuocTinh,
  IDDanhMuc,
  IDDanhMucCon)
  if (!IDSanPham) {
    return res.status(400).json({ message: 'IDSanPham is required and cannot be null' });
  }

  try {

      const newSanPham = new SanPhamModel({
         IDSanPham,
        TenSanPham,
        DonGiaNhap,
        DonGiaBan,
        SoLuongNhap,
        SoLuongHienTai,
        PhanTramGiamGia,
        TinhTrang,
        MoTa,
        Unit,
        DanhSachThuocTinh: DanhSachThuocTinh,
        IDDanhMuc,
        IDDanhMucCon,
      });

      // Lưu đối tượng vào cơ sở dữ liệu
      const savedSanPham = await newSanPham.save();
      res.status(201).json(savedSanPham);
  } catch (error) {
    console.error("Lỗi Them san pham bổ sung:", error);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
}
// //hàm thêm sản phẩm
// async function createSanPham(req, res, next) {
  
//   const {
//     IDSanPham,
//     TenSanPham,
//     DonGiaNhap,
//     DonGiaBan,
//     SoLuongNhap,
//     SoLuongHienTai,
//     PhanTramGiamGia,
//     NgayTao,
//     TinhTrang,
//     MoTa,
//     Unit,
//     TenAnh,
//     UrlAnh,
//     DanhSachThuocTinh,
//     IDDanhMuc,
//     IDDanhMucCon,
//   } = req.body;
//   console.log(IDSanPham)
//   try {
//     // const validation = await validateSanPham(IDSanPham, TenSanPham);
//     // if (!validation.valid) {
//     //   return res.status(404).json({ message: validation.message });
//     // }
//     // const validationThuocTinh = await validateDanhSachThuocTinh(DanhSachThuocTinh);
//     // if (!validationThuocTinh.valid) {
//     //   return res.status(404).json({ message: validationThuocTinh.message });
//     // }
//     //  upload.single('file')(req, res, async (err) => {
//     //   if (err instanceof multer.MulterError) {
//     //     return res.status(500).json({ error: err });
//     //   } else if (err) {
//     //     return res.status(500).json({   
//     //   error: err });
//     //   }
//     //   const newPath = req.file.path.replace(
//     //     "public",
//     //      process.env.URL_IMAGE
//     //   );


//         const newSanPham = new SanPhamModel({
//           IDSanPham:IDSanPham,
//           TenSanPham,
//           // HinhSanPham: newPath,
//           DonGiaNhap,
//           DonGiaBan,
//           SoLuongNhap,
//           SoLuongHienTai,
//           PhanTramGiamGia,
//           NgayTao,
//           TinhTrang,
//           MoTa,
//           Unit,
//           // HinhBoSung : "",
//           DanhSachThuocTinh: DanhSachThuocTinh,
//           IDDanhMuc,
//           IDDanhMucCon,
//         });
//         // Lưu đối tượng vào cơ sở dữ liệu
//         const savedSanPham = await newSanPham.save();
//         res.status(201).json(savedSanPham);

//     // Kiểm tra xem ThuocTinhID đã tồn tại chưa
//     // const existingThuocTinh = await SanPhamModel.findOne({ IDGiaTriThuocTinh });

//     // if (existingThuocTinh) {
//     //     return res.status(409).json({ message: 'Thuộc tính đã tồn tại' });
//     // }
//     // const newHinhSanPhams = [
//     //   {
//     //     TenAnh,
//     //     UrlAnh,
//     //   },
//     // ];
//     // Tạo một đối tượng thuộc tính mới dựa trên dữ liệu nhận được
    
//   // });
//     // Trả về kết quả cho client
   
//   } catch (error) {
//     if (error.code === 11000) {
//       console.error("Lỗi thêm sản phẩm đã tồn tại");
//       res.status(409).json({ message: 'Sản phẩm đã tồn tại' });
//     } else {
//       console.error("Lỗi khác:", error);
//       res.status(500).json({ error: 'Lỗi hệ thống' });
//     }
//   }
// }


async function updateHinhBoSung(req, res, next) {
  const { IDSanPham } = req.params;
  try {
    await upload.array('files', 4)(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: err });
      } else if (err) {
        return res.status(500).json({ error: err });
      }

      const hinhBoSung = req.files.map(file => ({
        TenAnh: file.originalname,
        UrlAnh: file.path.replace("public", process.env.URL_IMAGE),
      }));

      const sanPham = await SanPhamModel.findById(IDSanPham);
      if (!sanPham) {
        return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      }

      // Xóa ảnh cũ nếu tổng số ảnh vượt quá 4
      const totalImages = sanPham.HinhBoSung.length + hinhBoSung.length;
      if (totalImages > 4) {
        const imagesToRemove = totalImages - 4;
        for (let i = 0; i < imagesToRemove; i++) {
          const oldImage = sanPham.HinhBoSung.shift();
          const oldImagePath = path.join(__dirname, 'public', oldImage.UrlAnh.replace(process.env.URL_IMAGE, ''));
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error('Lỗi xóa ảnh cũ:', err);
          });
        }
      }

      sanPham.HinhBoSung = sanPham.HinhBoSung.concat(hinhBoSung);
      await sanPham.save();

      res.status(200).json(sanPham);
    });
  } catch (error) {
    console.error("Lỗi cập nhật ảnh bổ sung:", error);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
}


// async function updateSanPham(req, res, next) {
//   const { IDSanPham } = req.params;
//   const {
//     TenSanPham,
//     DonGiaNhap,
//     DonGiaBan,
//     SoLuongNhap,
//     SoLuongHienTai,
//     PhanTramGiamGia,
//     TinhTrang,
//     MoTa,
//     Unit,
//     TenAnh,
//     UrlAnh,
//     // DanhSachThuocTinh,
//     IDDanhMuc,
//     IDDanhMucCon,
//   } = req.body;

//   try {
//     const sanPham = await SanPhamModel.findById(IDSanPham);
//     if (!sanPham) {
//       return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
//     }
//     // const validation = await validateSanPham(IDSanPham, TenSanPham);
//     // if (!validation.valid) {
//     //   return res.status(404).json({ message: validation.message });
//     // }
    
//     // const validationThuocTinh = await validateDanhSachThuocTinh(DanhSachThuocTinh);
//     // if (!validationThuocTinh.valid) {
//     //   return res.status(404).json({ message: validationThuocTinh.message });
//     // }
//     await upload.single('file')(req, res, async (err) => {
//       if (err instanceof multer.MulterError) {
//         return res.status(500).json({ error: err });
//       } else if (err) {
//         return res.status(500).json({ error: err });
//       }

//       // // Xóa ảnh cũ
//       // const oldImagePath = path.join(__dirname, 'public', sanPham.HinhSanPham.replace(process.env.URL_IMAGE, ''));
//       // fs.unlink(oldImagePath, (err) => {
//       //   if (err) console.error('Lỗi xóa ảnh cũ:', err);
//       // });

//       const newPath = req.file.path.replace("public", process.env.URL_IMAGE);

//       sanPham.TenSanPham = TenSanPham;
//       sanPham.HinhSanPham = newPath;
//       sanPham.DonGiaNhap = DonGiaNhap;
//       sanPham.DonGiaBan = DonGiaBan;
//       sanPham.SoLuongNhap = SoLuongNhap;
//       sanPham.SoLuongHienTai = SoLuongHienTai;
//       sanPham.PhanTramGiamGia = PhanTramGiamGia;
//       sanPham.TinhTrang = TinhTrang;
//       sanPham.MoTa = MoTa;
//       sanPham.Unit = Unit;
//       // sanPham.DanhSachThuocTinh = DanhSachThuocTinh;
//       sanPham.IDDanhMuc = IDDanhMuc;
//       sanPham.IDDanhMucCon = IDDanhMucCon;

//       await sanPham.save();
//       res.status(200).json(sanPham);
//     });
//   } catch (error) {
//     console.error("Lỗi cập nhật sản phẩm:", error);
//     res.status(500).json({ error: 'Lỗi hệ thống' });
//   }
// }
async function updateSanPham(req, res, next) {
  const {
    IDSanPham,
    TenSanPham,
    DonGiaNhap,
    DonGiaBan,
    SoLuongNhap,
    SoLuongHienTai,
    PhanTramGiamGia,
    NgayTao,
    TinhTrang,
    MoTa,
    Unit,
    DanhSachThuocTinh,
    IDDanhMuc,
    IDDanhMucCon,
  } = req.body;

  if (!IDSanPham) {
    return res.status(400).json({ message: 'IDSanPham is required and cannot be null' });
  }

  try {
    await uploadFields(req, res);

    const sanPham = await SanPhamModel.findOne({ IDSanPham });
    if (!sanPham) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    if (req.files && req.files['file'] && req.files['file'][0]) {
      // Xóa ảnh cũ
      const oldImagePath = sanPham.HinhSanPham.replace(process.env.URL_IMAGE, 'public');
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      // Cập nhật ảnh mới
      const newPath = req.files['file'][0].path.replace("public", process.env.URL_IMAGE);
      sanPham.HinhSanPham = newPath;
    }

    if (req.files && req.files['files']) {
      // Xóa các ảnh bổ sung cũ
      sanPham.HinhBoSung.forEach(hinh => {
        const oldImagePath = hinh.UrlAnh.replace(process.env.URL_IMAGE, 'public');
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      });

      // Cập nhật các ảnh bổ sung mới
      const hinhBoSung = req.files['files'].map(file => ({
        TenAnh: file.originalname,
        UrlAnh: file.path.replace("public", process.env.URL_IMAGE),
      }));
      sanPham.HinhBoSung = hinhBoSung;
    }

    // Cập nhật các thông tin khác
    sanPham.TenSanPham = TenSanPham;
    sanPham.DonGiaNhap = DonGiaNhap;
    sanPham.DonGiaBan = DonGiaBan;
    sanPham.SoLuongNhap = SoLuongNhap;
    sanPham.SoLuongHienTai = SoLuongHienTai;
    sanPham.PhanTramGiamGia = PhanTramGiamGia;
    sanPham.NgayTao = NgayTao;
    sanPham.TinhTrang = TinhTrang;
    sanPham.MoTa = MoTa;
    sanPham.Unit = Unit;
    sanPham.DanhSachThuocTinh = DanhSachThuocTinh;
    sanPham.IDDanhMuc = IDDanhMuc;
    sanPham.IDDanhMucCon = IDDanhMucCon;

    const updatedSanPham = await sanPham.save();
    res.status(200).json(updatedSanPham);
  } catch (error) {
    console.error("Lỗi cập nhật sản phẩm:", error);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
}

async function deleteSanPham(req, res, next) {
  const { IDSanPham } = req.params;

  try {
    const sanPham = await SanPhamModel.findById(IDSanPham);
    if (!sanPham) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    // Cập nhật trạng thái sản phẩm thành "Đã xóa"
    sanPham.TinhTrang = 'Đã xóa';
    await sanPham.save();

    res.status(200).json({ message: 'Sản phẩm đã được cập nhật trạng thái thành "Đã xóa"' });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái sản phẩm:", error);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
}

async function updateTinhTrangSanPham(req, res, next) {
  const { IDSanPham } = req.params;
  const { TinhTrang } = req.body;

  try {
    const sanPham = await SanPhamModel.findById(IDSanPham);
    if (!sanPham) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    // Cập nhật trạng thái sản phẩm thành "Đã xóa"
    sanPham.TinhTrang = TinhTrang;
    await sanPham.save();

    res.status(200).json({ message: 'Sản phẩm đã được cập nhật trạng thái thành '+TinhTrang });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái sản phẩm:", error);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
}
async function createSanPhamVoiBienThe(req, res) {
  // Tạo sản phẩm gốc
  const projection = {
    _id: 1,
    // Set chapters to null explicitly
  };
  const {IDSanPham} = req.params;
  const { sku,gia,soLuong, } = req.body;
  // const validation = validateSanPhamData(sku, gia, soLuong);
  // if (!validation.valid) {
  //   return res.status(400).json({ errors: validation.errors });
  // }
  const product = await SanPhamModel.findById(IDSanPham).populate(
    "DanhSachThuocTinh.thuocTinh"
  );
  if(!product){
    return res.status(404).json({message :"sản phẩm không tồn tại"});
  }
  const attributeIds = product.DanhSachThuocTinh;
  console.log(attributeIds);
  // // Tạo các biến thể sản phẩm
  const createVariants = async (product, thuocTinhs, currentVariant = {}) => {
    if (thuocTinhs.length === 0) {
      // Tạo biến thể mới
      console.log("check  ket hop", currentVariant);
      const KetHopThuocTinh = Object.entries(currentVariant).map(
        ([key, value]) => ({
          IDGiaTriThuocTinh: value,
        })
      );
      const newVariant = new BienTheSchema({
        IDSanPham: product._id,
        sku: sku,
        gia: gia,
        soLuong: soLuong,
        KetHopThuocTinh: KetHopThuocTinh,
      });
      await newVariant.save();
      console.log(newVariant);
    } else {
      const thuocTinh = thuocTinhs.shift();
      console.log("thuoc tinh abababa la zap", thuocTinh);
      const giaTriThuocTinhList = await ThuocTinhGiaTriModel.find(
        { ThuocTinhID: thuocTinh },
        projection
      );
      console.log(giaTriThuocTinhList);
      for (const giaTri of giaTriThuocTinhList) {
        const IDGiaTriThuocTinh = giaTri._id; // Destructure to get the value ID
        currentVariant = { ...currentVariant, [thuocTinh]: IDGiaTriThuocTinh };
        await createVariants(product, [...thuocTinhs], currentVariant);
      }

    }
  };

  await createVariants(product, attributeIds);
// Điều kiện dừng: Kiểm tra nếu tất cả các biến thể đã được tạo xong
const totalCombinations = attributeIds.reduce((acc, attr) => acc * attr.length, 1);
const variantsCount = await BienTheSchema.countDocuments({ IDSanPham: product._id });
if (variantsCount === totalCombinations) {
  console.log("Tất cả các biến thể đã được tạo xong");
}
  return product;
}

//code them thuoc tinh vao ben trong san pham
async function createThuocTinhSanPham(req, res, next) {
  const {ThuocTinhID } = req.body;
  const {IDSanPham} = req.params

  try {
    // Tìm sản phẩm theo ID
    const sanPham = await SanPhamModel.findById(IDSanPham);
    if (!sanPham) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" }); // Trả về lỗi HTTP 404
    }

    // Thêm ThuocTinhID vào mảng DanhSachThuocTinh
    sanPham.DanhSachThuocTinh.push(ThuocTinhID);
    // const validationThuocTinh = await validateDanhSachThuocTinh(sanPham.DanhSachThuocTinh);
    // if (!validationThuocTinh.valid) {
    //   return res.status(404).json({ message: validationThuocTinh.message });
    // }
    // Lưu thay đổi
    const sanPhamUpdated = await sanPham.save();

    return res.json(sanPhamUpdated); // Trả về sản phẩm đã cập nhật
  } catch (error) {
    console.error("Lỗi khi thêm thuộc tính:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" }); // Trả về lỗi HTTP 500
  }
}

//hamdequy
async function getlistBienThe(req, res, next) {
  const { IDSanPham } = req.params;
  console.log(IDSanPham);
  try {
    const BienThe = await BienTheSchema.find({ IDSanPham: IDSanPham }).populate('KetHopThuocTinh.IDGiaTriThuocTinh');
    res.status(200).json(BienThe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi truy xuat san pham" });
  }
}
//create biến thể sản phẩm chay , dự phòng
async function createBienTheThuCong(req, res, next) {
  const { IDSanPham } = req.params;
  const {  sku, gia, soLuong, KetHopThuocTinh } = req.body;
  try {
    // truyền vào một kethopthuoctinh có 2 id của giatrithuoctinh la dc biến của giá trị thuộc tính là IDGiaTriThuocTinh 

    // Tạo một đối tượng thuộc tính mới dựa trên dữ liệu nhận được
    const newBienThe = new BienTheSchema({
      IDSanPham,
      sku,
      gia,
      soLuong,
      KetHopThuocTinh,
    });
    // Lưu đối tượng vào cơ sở dữ liệu
    const savedBienThe = await newBienThe.save();

    // Trả về kết quả cho client
    res.status(201).json(newBienThe);
  } catch (error) {
    if (error.code === 11000) {
      console.error("Lỗi thêm biến thể đã tồn tại");
    } else {
      console.error("Lỗi khác:", error);
    }
  }
}


async function findSanPham(req, res, next) {
  const { ThuocTinhID } = req.params;

  let query = {};
  if (ThuocTinhID) {
    query.ThuocTinhID = ThuocTinhID;
  }

  try {
    const thuocTinhs = await SanPhamModel.find(query);
    res.status(200).json(thuocTinhs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi tìm kiếm giá trị thuộc tính" });
  }
}

async function findSanPhambyID(req, res, next) {
  const { IDSanPham } = req.params;
  console.log(IDSanPham);
  let query = {};
  if (IDSanPham) {
    query.IDSanPham = IDSanPham;
  }

  try {
    const IDSanPhams = await SanPhamModel.findById(IDSanPham);
    res.status(200).json(IDSanPhams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi tìm kiếm giá trị thuộc tính" });
  }
}

async function getlistPageSanPham(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sanphams = await SanPhamModel.find().skip(skip).limit(limit);
    const totalProducts = await SanPhamModel.countDocuments();

    res.status(200).json({
      sanphams,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi truy xuất sản phẩm" });
  }
}
async function getlistBienTheInSanPham(req, res, next) {
  const { IDSanPham } = req.params;
  console.log(IDSanPham);
  try {
    const bienThe = await BienTheSchema.find({ IDSanPham: IDSanPham }).populate(
      "KetHopThuocTinh.IDGiaTriThuocTinh"
    );

    res.status(200).json(bienThe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi tìm kiếm giá trị thuộc tính" });
  }
}

async function findSanPhamByDanhMuc(req, res, next) {
  const { IDDanhMuc } = req.params;

  try {
    const sanphams = await SanPhamModel.find({ IDDanhMuc });

    if (!sanphams || sanphams.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json(sanphams);
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm theo danh mục:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi tìm kiếm sản phẩm theo danh mục" });
  }
}

async function sapXepSanPhamTheoGia(req, res, next) {
  try {
    const sanPhams = await SanPhamModel.find().sort({ DonGiaBan: 1 }); // Sắp xếp tăng dần

    return res.status(200).json(sanPhams);
  } catch (error) {
    console.error("Lỗi khi sắp xếp sản phẩm:", error);
    res.status(500).json({ message: "Lỗi khi sắp xếp sản phẩm" });
  }
}
async function sapXepSanPhamTheoGiaGiamDan(req, res, next) {
  try {
    const sanPhams = await SanPhamModel.find().sort({ DonGiaBan: -1 }); // Sắp xếp tăng dần

    return res.status(200).json(sanPhams);
  } catch (error) {
    console.error("Lỗi khi sắp xếp sản phẩm:", error);
    res.status(500).json({ message: "Lỗi khi sắp xếp sản phẩm" });
  }
}

async function sapXepSanPhamTheoNgayTao(req, res, next) {
  try {
    const sanPhams = await SanPhamModel.find().sort({ NgayTao: 1 }); // Sắp xếp tăng dần

    return res.status(200).json(sanPhams);
  } catch (error) {
    console.error("Lỗi khi sắp xếp sản phẩm:", error);
    res.status(500).json({ message: "Lỗi khi sắp xếp sản phẩm" });
  }
}
async function sapXepSanPhamNgayTaoGiamDan(req, res, next) {
  try {
    const sanPhams = await SanPhamModel.find().sort({ NgayTao: -1 }); // Sắp xếp tăng dần

    return res.status(200).json(sanPhams);
  } catch (error) {
    console.error("Lỗi khi sắp xếp sản phẩm:", error);
    res.status(500).json({ message: "Lỗi khi sắp xếp sản phẩm" });
  }
}

async function sapXepSanPhamBanChayNhat(req, res, next) {
  try {
    const sanPhams = await SanPhamModel.aggregate([
      {
        $addFields: {
          SoLuongDaBan: { $subtract: ["$SoLuongNhap", "$SoLuongHienTai"] },
        },
      },
      {
        $sort: { soLuongDaBan: -1 },
      },
    ]);
    return res.status(200).json(sanPhams);
  } catch (error) {
    console.error("Lỗi khi sắp xếp sản phẩm:", error);
    res.status(500).json({ message: "Lỗi khi sắp xếp sản phẩm" });
  }
}
async function sapXepSanPhamCoGiamGia(req, res, next) {
  try {
    const sanPhams = await SanPhamModel.find({ PhanTramGiamGia: { $gt: 0 } });

    return res.status(200).json(sanPhams);
  } catch (error) {
    console.error("Lỗi khi sắp xếp sản phẩm:", error);
    res.status(500).json({ message: "Lỗi khi sắp xếp sản phẩm" });
  }
}

async function findSanPhamByDanhMuc(req, res, next) {
  const { IDDanhMuc } = req.params;

  try {
    const sanphams = await SanPhamModel.find({ IDDanhMuc });

    if (!sanphams || sanphams.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json(sanphams);
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm theo danh mục:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi tìm kiếm sản phẩm theo danh mục" });
  }
}
//hàm chuyển đổi ngày tạo sang ngày việt nam
// async function layNgayTaoSanPham(idSanPham) {
//   try {
//     const sanPham = await SanPham.findById(idSanPham);
//     if (sanPham) {
//       const ngayTao = sanPham.NgayTao; // Đối tượng Date
//       // Định dạng lại ngày tạo theo mong muốn
//       const ngayTaoFormat = ngayTao.toLocaleDateString('vi-VN'); // Định dạng theo tiếng Việt
//       console.log('Ngày tạo sản phẩm:', ngayTaoFormat);
//     } else {
//       console.log('Không tìm thấy sản phẩm');
//     }
//   } catch (error) {
//     console.error('Lỗi khi lấy ngày tạo:', error);
//   }
// }

async function validateSanPham(IDSanPham, TenSanPham) {
  const sanPham = await SanPhamModel.findOne({ IDSanPham, TenSanPham });
  if (!sanPham) {
    return { valid: false, message: 'Sản phẩm không tồn tại' };
  }
  return { valid: true, sanPham };
}
function validateDanhSachThuocTinh(DanhSachThuocTinh) {
  if (!Array.isArray(DanhSachThuocTinh)) {
    return { valid: false, message: 'Danh sách thuộc tính phải là một mảng' };
  }

  const idSet = new Set();

  for (const thuocTinh of DanhSachThuocTinh) {
    if (!thuocTinh.IDThuocTinh) {
      return { valid: false, message: 'Mỗi thuộc tính phải có IDThuocTinh' };
    }

    if (idSet.has(thuocTinh.IDThuocTinh)) {
      return { valid: false, message: `Thuộc tính với ID ${thuocTinh.IDThuocTinh} bị trùng` };
    }

    idSet.add(thuocTinh.IDThuocTinh);
  }

  return { valid: true };
}
function validateSanPhamData(sku, gia, soLuong) {
  const errors = [];

  // Kiểm tra sku
  if (!sku) {
    errors.push('SKU không được để trống');
  }

  // Kiểm tra gia
  if (gia === undefined || gia === null) {
    errors.push('Giá không được để trống');
  } else if (typeof gia !== 'number') {
    errors.push('Giá phải là số');
  }

  // Kiểm tra soLuong
  if (soLuong === undefined || soLuong === null) {
    errors.push('Số lượng không được để trống');
  } else if (typeof soLuong !== 'number') {
    errors.push('Số lượng phải là số');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}


module.exports = {
  getlistSanPham,
  getSanPhamListNew_Old,
  toggleSanPhamMoi,
  createSanPham,
  updateHinhBoSung,
  createSanPhamVoiBienThe,
  createThuocTinhSanPham,
  getlistBienThe,
  createBienTheThuCong,
  updateSanPham,
  deleteSanPham,
  updateTinhTrangSanPham,
  findSanPham,
  findSanPhamByDanhMuc,
  getlistPageSanPham,
  // createimageSanPham,
  // updateimageSanPham,
  // deleteImageSanPham,
  findSanPhambyID,
  getlistBienTheInSanPham,
  sapXepSanPhamTheoGia,
  sapXepSanPhamTheoGiaGiamDan,
  sapXepSanPhamTheoNgayTao,
  sapXepSanPhamNgayTaoGiamDan,
  sapXepSanPhamBanChayNhat,
  sapXepSanPhamCoGiamGia,
  // getlistSanPham,
  // createSanPham,
  // createSanPhamVoiBienThe,
  // createThuocTinhSanPham,
  // createbienthesanpham,
  // getlistBienTheFake,
  // createBienTheFake,
  // updateSanPham,
  // deleteSanPham,
  // findSanPham,
  // findSanPhambyID,
  // getlistPageSanPham,
  createSanPhamtest,
};
