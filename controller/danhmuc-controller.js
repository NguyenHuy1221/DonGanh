const DanhMucModel = require("../models/DanhMucSchema");

require("dotenv").config();
const multer = require("multer");


//ham lay danh sach thuoc tinh
async function getlistDanhMuc(req, res, next) {

    try {
        const DanhMucs = await DanhMucModel.find();
        res.status(200).json(DanhMucs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi tìm kiếm danh mục' });
    }
}

// const DanhMucConSchema = new Schema({
//     _id: { type: Schema.Types.ObjectId, required: true }, // ID của danh mục con
//     TenDanhMucCon: { type: String, required: true },
//     MieuTa: String
//   });
  
// add products
// mediaRouter.post(
//     "/createProductsMultiple",
//     upload.single("file"),
//     async (req, res) => {
//       const {
//         ten,
//         donGiaNhap,
//         donGiaBan,
//         soLuongNhap,
//         soLuongDaBan,
//         category,
//         moTa,
//         tinhTrang,
//       } = req.body;
  
//       try {
//         const newPath = req.file.path.replace(
//           "public",
//           "https://imp-model-widely.ngrok-free.app/"
//         );
  
//         await ProductModel.create({
//           ten,
//           hinh: newPath,
//           donGiaNhap,
//           donGiaBan,
//           soLuongNhap,
//           soLuongDaBan,
//           category,
//           moTa,
//           tinhTrang,
//         });
  
//         return res.json({
//           message: "Thêm sản phẩm thành công",
//         });
//       } catch (error) {
//         console.error("Lỗi khi thêm sản phẩm:", error);
//         return res
//           .status(500)
//           .json({ message: "Đã xảy ra lỗi khi thêm sản phẩm" });
//       }
//     }
//   );
//hàm thêm thuộc tính

//const {upload} = require("../untils/index")
// async function createDanhMuc(req, res, next) {
//     upload.single("file"), async (req, res) => {
//         console.log("aaa2")
//         if (err instanceof multer.MulterError) {
//             return res.status(500).json({ error: err });
//         } else if (err) {
//             return res.status(500).json({error: err });
//         }
//         const newPath = req.file.path.replace(
//             "public",
//             "https://imp-model-widely.ngrok-free.app/"
//           ); 
//           console.log(newPath)
//           const { IDDanhMuc, TenDanhMuc } = req.body;

//           const existingDanhMuc = await DanhMucModel.findOne({ IDDanhMuc });
//           if (existingDanhMuc) {
//               return res.status(409).json({ message: 'Thuộc tính đã tồn tại' });
//           }
//           // Tạo một đối tượng thuộc tính mới dựa trên dữ liệu nhận được
//         const newDanhMuc = new ThuocTinhModel({
//             IDDanhMuc,
//             TenDanhMuc,
//             AnhDanhMuc : newPath
//         });
//         // Lưu đối tượng vào cơ sở dữ liệu
//         const savedDanhMuc = await newDanhMuc.save();

//         // Trả về kết quả cho client
//         res.status(201).json(savedDanhMuc);

//     }
 
// }

// const { upload } = require("../untils/index");

// async function createDanhMuc(req, res, next) {
//     try {
//         // Upload file trước
//         upload.single('file')(req, res, async (err) => {
//             if (err instanceof multer.MulterError) {
//                 return res.status(500).json({ error: err });
//             } else if (err) {
//                 return res.status(500).json({ error: err });
//             }
//         const newPath = req.file.path.replace(
//             "public",
//             "https://imp-model-widely.ngrok-free.app/"
//           ); 
//             const { IDDanhMuc, TenDanhMuc } = req.body;
//             console.log(IDDanhMuc)
//             const existingDanhMuc = await DanhMucModel.findOne({ IDDanhMuc });
//           if (existingDanhMuc) {
//               return res.status(409).json({ message: 'Thuộc tính đã tồn tại' });
//           }
//           // Tạo một đối tượng thuộc tính mới dựa trên dữ liệu nhận được
//         const newDanhMuc = await DanhMucModel.create({
//             IDDanhMuc : IDDanhMuc,
//             TenDanhMuc : TenDanhMuc,
//             AnhDanhMuc : newPath
//         });

//         console.log(newDanhMuc)
//         // Lưu đối tượng vào cơ sở dữ liệu
//         // const savedDanhMuc = await newDanhMuc.save();

//         // Trả về kết quả cho client
//         res.status(201).json(newDanhMuc);
//         });
//     } catch (error) {
//         console.error('Lỗi khi tạo danh mục:', error);
//         res.status(500).json({ message: 'Lỗi server' });
//     }
// }
   
 const { upload } = require("../untils/index");

// async function createDanhMuc(req, res, next) {
//     try {
//         upload.single('file')(req, res, async (err) => {
//             if (err instanceof multer.MulterError) {
//                 return res.status(500).json({ error: err });
//             } else if (err) {
//                 return res.status(500).json({ error: err });
//             }

//             const { IDDanhMuc, TenDanhMuc } = req.body;

//             // Kiểm tra dữ liệu đầu vào
//             if (!IDDanhMuc || !TenDanhMuc) {
//                 return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
//             }

//             const newPath = req.file.path.replace(
//                 "public",
//                 // Sử dụng thư viện path để xây dựng đường dẫn một cách an toàn
//                 path.join(__dirname, '../', 'uploads')
//             ); 

//             // Tạo đối tượng danh mục
//             const newDanhMuc = await DanhMucModel.create({
//                 IDDanhMuc,
//                 TenDanhMuc,
//                 AnhDanhMuc: newPath
//             });

//             res.status(201).json(newDanhMuc);
//         });
//     } catch (error) {
//         console.error('Lỗi khi tạo danh mục:', error);
//         res.status(500).json({ message: 'Lỗi server', error });
//     }
// }



async function createDanhMuc(req, res, next) {
    try {
      upload.single('file')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(500).json({ error: err });
        } else if (err) {
          return res.status(500).json({   
   error: err });
        }
  
        const{ IDDanhMuc, TenDanhMuc } = req.body;
        console.log(IDDanhMuc,TenDanhMuc)
        if (!IDDanhMuc || !TenDanhMuc || !req.file) {
          return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }
  

        const newPath = req.file.path.replace(
            "public",
             process.env.URL_IMAGE
          );
        try {
          const newDanhMuc = await DanhMucModel.create({
            IDDanhMuc,
            TenDanhMuc,
            AnhDanhMuc: newPath
          });
  
          res.status(201).json(newDanhMuc);
        } catch (error) {
          console.error('Lỗi khi tạo danh mục:', error);
          // Xử lý lỗi cụ thể của Mongoose (ví dụ: ValidationError, DuplicateKeyError)
          res.status(500).json({ message: 'Lỗi server', error });
        }
      });
    } catch (error) {
      console.error('Lỗi chung:', error);
      res.status(500).json({ message: 'Lỗi server', error });
    }
  }
  async function updateDanhMuc(req, res, next) {
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


// async function createDanhMuc(req, res, next) {
//     try {


//             const { IDDanhMuc, TenDanhMuc,newPath,DanhMucCon } = req.body;

//             // Kiểm tra dữ liệu đầu vào
//             if (!IDDanhMuc || !TenDanhMuc) {
//                 return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
//             }


//             // Tạo đối tượng danh mục
//             const newDanhMuc = await DanhMucModel.create({
//                 IDDanhMuc,
//                 TenDanhMuc,
//                 AnhDanhMuc: newPath,
//                 DanhMucCon : DanhMucCon
//             });

//             res.status(201).json(newDanhMuc);
      
//     } catch (error) {
//         console.error('Lỗi khi tạo danh mục:', error);
//         res.status(500).json({ message: 'Lỗi server', error });
//     }
// }
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
    getlistDanhMuc,
    createDanhMuc,
    updateThuocTinh,
    deleteThuocTinh,
    findThuocTinh,
};
