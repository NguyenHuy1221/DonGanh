const SanPhamModel = require("../models/SanPhamSchema");
const ThuocTinhModel = require("../models/ThuocTinhSchema");
const ThuocTinhGiaTriModel = require("../models/GiaTriThuocTinhSchema");
const BienTheSchema = require("../models/BienTheSchema")


require("dotenv").config();


//ham lay danh sach thuoc tinh
async function getlistSanPham(req, res, next) {

    try {
        const sanphams = await SanPhamModel.find();
        res.status(200).json(sanphams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi truy xuat san pham' });
    }
}


//hàm thêm sản phẩm
async function createSanPham(req, res, next) {
    const { IDSanPham,TenSanPham, HinhSanPham ,DonGiaNhap,DonGiaBan,SoLuongNhap,SoLuongHienTai,PhanTramGiamGia,NgayTao,TinhTrang,MoTa,Unit,TenAnh,UrlAnh,DanhSachThuocTinh,IDDanhMuc,IDDanhMucCon} = req.body;
    try {

        // Kiểm tra xem ThuocTinhID đã tồn tại chưa
    // const existingThuocTinh = await SanPhamModel.findOne({ IDGiaTriThuocTinh });

    // if (existingThuocTinh) {
    //     return res.status(409).json({ message: 'Thuộc tính đã tồn tại' });
    // }
    const newHinhSanPhams =[{
        TenAnh,
        UrlAnh
    }]
        // Tạo một đối tượng thuộc tính mới dựa trên dữ liệu nhận được
        const newSanPham = new SanPhamModel({
            IDSanPham,
            TenSanPham,
            HinhSanPham,
            DonGiaNhap,
            DonGiaBan,
            SoLuongNhap,
            SoLuongHienTai,
            PhanTramGiamGia,
            NgayTao,
            TinhTrang,
            MoTa,
            Unit,
            newHinhSanPhams,
            DanhSachThuocTinh,
            IDDanhMuc,
            IDDanhMucCon,

        });
        // Lưu đối tượng vào cơ sở dữ liệu
        const savedSanPham = await newSanPham.save();

        // Trả về kết quả cho client
        res.status(201).json(newSanPham);
    } catch (error) {
        if (error.code === 11000) {
            console.error('Lỗi thêm sản phẩm đã tồn tại');
          } else {
            console.error('Lỗi khác:', error);
          }
    }
}
 
// //hàm thêm thuộc tính vào sản phẩm
// async function createThuocTinhSanPham(req, res, next) {
//     const { IDSanPham,ThuocTinhID} = req.body;
//     try {
//         const sanPham = await SanPhamModel.find({IDSanPham:IDSanPham});
//         if (!sanPham) {
//           return 'Không tìm thấy sản phẩm';
//         }
    
//         sanPham.DanhSachThuocTinh.push(ThuocTinhID);
//         const sanPhamUpdated = await sanPham.save();
//         return sanPhamUpdated;
//       } catch (error) {
//         console.error('Lỗi khi thêm thuộc tính:', error);
//         return null;
//       }
// }

async function createThuocTinhSanPham(req, res, next) {
    const { IDSanPham, ThuocTinhID } = req.body;
  
    try {
      // Tìm sản phẩm theo ID
      const sanPham = await SanPhamModel.findById(IDSanPham);
      if (!sanPham) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' }); // Trả về lỗi HTTP 404
      }
  
      // Thêm ThuocTinhID vào mảng DanhSachThuocTinh
      sanPham.DanhSachThuocTinh.push(ThuocTinhID);
  
      // Lưu thay đổi
      const sanPhamUpdated = await sanPham.save();
  
      return res.json(sanPhamUpdated); // Trả về sản phẩm đã cập nhật
    } catch (error) {
      console.error('Lỗi khi thêm thuộc tính:', error);
      return res.status(500).json({ message: 'Lỗi hệ thống' }); // Trả về lỗi HTTP 500
    }
  }

//hamdequy
  async function createbienthesanpham(req, res, next) {
    const { IDSanPham } = req.body;
    const projection = {
        _id : 0,
        GiaTri: 1,
        // Set chapters to null explicitly
      };
    const sanPham = await SanPhamModel.findById(IDSanPham);
      if (!sanPham) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' }); // Trả về lỗi HTTP 404
      }
      // Lấy danh sách ID thuộc tính
      let attributeValuesMap = {}
  const ThuocTinhID = sanPham.DanhSachThuocTinh;
      console.log(ThuocTinhID)
      for (let i = 0; i < ThuocTinhID.length; i++) {
        console.log(ThuocTinhID[i]); // In ra từng phần tử
        const thuocTinhgiatri = await ThuocTinhGiaTriModel.find({ThuocTinhID:ThuocTinhID[i]},projection);
        attributeValuesMap[ThuocTinhID[i]] = thuocTinhgiatri;
        
    }
    console.log(attributeValuesMap)
    // const attributeValuesMap = {
    //     ThuocTinhID[i]: ['a1', 'a2'],
    //     'thu bbb': ['b1', 'b2', 'b3']
    //   };
  // Giả sử các giá trị của thuộc tính là: a1, a2, a3, b1, b2, b3
//   const attributeValues = ["a1", "a2", "a3", "b1", "b2", "b3"];

//   // Tạo một hàm đệ quy để tạo các tổ hợp
//   function generateCombinations(current, remaining) {
//     if (!remaining.length) {
//       combinations.push(current.join(''));
//       return;
//     }

//     const next = remaining[0];
//     for (let i = 0; i < attributeValuesMap.length; i++) {
//         for (const value of attributeValuesMap[i]) {
//             generateCombinations([...current, value], remaining.slice(1));
//           }
        
//     }
    
//   }
function generateCombinations(current, remaining) {
    if (!remaining.length) {
      combinations.push(current.join(','));
      return;
    }
  
    const nextId = remaining[0];
    const values = attributeValuesMap[nextId];
  
    for (const value of values) {
      generateCombinations([...current, value], remaining.slice(1));
    }
  }
  // Khởi tạo mảng để lưu các tổ hợp
  const combinations = [];

  // Gọi hàm đệ quy để tạo các tổ hợp
  generateCombinations([], ThuocTinhID);
console.log(combinations);
return combinations;
  }



  async function getlistBienTheFake(req, res, next) {
    const {IDSanPham} = req.body;
    console.log(IDSanPham)
    try {
        const BienThe = await BienTheSchema.find({IDSanPham:IDSanPham});
        res.status(200).json(BienThe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi truy xuat san pham' });
    }
}
//create biến thể sản phẩm chay , dự phòng
async function createBienTheFake(req, res, next) {
  const { IDSanPham,sku, gia ,soLuong,KetHopThuocTinh} = req.body;
  try {

      // Kiểm tra xem ThuocTinhID đã tồn tại chưa
  // const existingThuocTinh = await SanPhamModel.findOne({ IDGiaTriThuocTinh });

  // if (existingThuocTinh) {
  //     return res.status(409).json({ message: 'Thuộc tính đã tồn tại' });
  // }

      // Tạo một đối tượng thuộc tính mới dựa trên dữ liệu nhận được
      const newBienThe= new BienTheSchema({
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
          console.error('Lỗi thêm biến thể đã tồn tại');
        } else {
          console.error('Lỗi khác:', error);
        }
  }
}















   
async function updateSanPham(req, res, next) {
    // const { ThuocTinhID } = req.params;
    const { IDGiaTriThuocTinh,GiaTri  } = req.body;

    try {
        const updatedThuocTinhGiaTri = await SanPhamModel.findOneAndUpdate(
            { IDGiaTriThuocTinh },
            { GiaTri },
            { new: true }
        );

        if (!updatedThuocTinhGiaTri) {
            return res.status(404).json({ message: 'Không tìm thấy giá trị thuộc tính' });
        }
        
        res.status(200).json(updatedThuocTinhGiaTri);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi cập nhật giá trị thuộc tính' });
    }
}

async function deleteSanPham(req, res, next) {
    const { IDGiaTriThuocTinh  } = req.params;

    try {
        const deletedThuocTinhGiaTri = await SanPhamModel.findOneAndDelete( IDGiaTriThuocTinh );

        if (!deletedThuocTinhGiaTri) {
            return res.status(404).json({ message: 'Không tìm thấy giá trị thuộc tính' });
        }

        res.status(200).json({ message: 'Xóa thuộc giá trị tính thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa giá trị thuộc tính' });
    }
}

async function findSanPham(req, res, next) {
    const {ThuocTinhID  } = req.params;

    let query = {};
    if (ThuocTinhID) {
        query.ThuocTinhID = ThuocTinhID;
    }

    try {
        const thuocTinhs = await SanPhamModel.find(query);
        res.status(200).json(thuocTinhs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi tìm kiếm giá trị thuộc tính' });
    }
}



module.exports = {
    getlistSanPham,
    createSanPham,
    createThuocTinhSanPham,
    createbienthesanpham,
    getlistBienTheFake,
    createBienTheFake,
    updateSanPham,
    deleteSanPham,
    findSanPham,
};
