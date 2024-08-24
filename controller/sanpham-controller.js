const SanPhamModel = require("../models/SanPhamSchema");
const ThuocTinhModel = require("../models/ThuocTinhSchema");
const ThuocTinhGiaTriModel = require("../models/GiaTriThuocTinhSchema");
const BienTheSchema = require("../models/BienTheSchema");
const mongoose = require("mongoose");

require("dotenv").config();

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

//hàm thêm sản phẩm
async function createSanPham(req, res, next) {
  const {
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
    TenAnh,
    UrlAnh,
    DanhSachThuocTinh,
    IDDanhMuc,
    IDDanhMucCon,
  } = req.body;
  try {
    // Kiểm tra xem ThuocTinhID đã tồn tại chưa
    // const existingThuocTinh = await SanPhamModel.findOne({ IDGiaTriThuocTinh });

    // if (existingThuocTinh) {
    //     return res.status(409).json({ message: 'Thuộc tính đã tồn tại' });
    // }
    const newHinhSanPhams = [
      {
        TenAnh,
        UrlAnh,
      },
    ];
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
      console.error("Lỗi thêm sản phẩm đã tồn tại");
    } else {
      console.error("Lỗi khác:", error);
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

async function createSanPhamVoiBienThe(req, res) {
  // Tạo sản phẩm gốc
  const projection = {
    _id: 1,
    // Set chapters to null explicitly
  };
  const { IDSanPham } = req.body;
  const product = await SanPhamModel.findById(IDSanPham).populate(
    "DanhSachThuocTinh.thuocTinh"
  );
  const attributeIds = product.DanhSachThuocTinh;
  console.log(attributeIds);
  // let attributeValuesMap = []
  // // const ThuocTinhID = Product.DanhSachThuocTinh;
  // //     console.log(ThuocTinhID)
  //     for (let i = 0; i < attributeIds.length; i++) {
  //       console.log(attributeIds[i]); // In ra từng phần tử
  //       const thuocTinhgiatri = await ThuocTinhGiaTriModel.find({ThuocTinhID:attributeIds[i]},projection);

  //       attributeValuesMap[attributeIds[i]] = thuocTinhgiatri;

  //   }
  //   console.log(attributeValuesMap)

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

      // const KetHopThuocTinh2 = [{IDGiaTriThuocTinh:"66c0166f71819b042379ac36"},
      //   {IDGiaTriThuocTinh:"66c01a35577ef0bfbf76962c"}
      // ]
      // console.log("updatedVariant",KetHopThuocTinh);
      // console.log("KetHopThuocTinh2",KetHopThuocTinh2);
      const newVariant = new BienTheSchema({
        IDSanPham: product._id,
        sku: "aa",
        gia: 100,
        soLuong: 10,
        // ... các trường khác
        //ketHopThuocTinh: Object.values(updatedVariant)
        KetHopThuocTinh: KetHopThuocTinh,
      });
      if (!newVariant.ketHopThuocTinh) {
        console.log(newVariant);
        return console.log("ket hop thuoc tinh rong");
      }
      //await newVariant.save();
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
        //currentVariant = { ...currentVariant, [thuocTinh]: _id }; // Update currentVariant
        currentVariant = { ...currentVariant, [thuocTinh]: IDGiaTriThuocTinh };
        await createVariants(product, [...thuocTinhs], currentVariant);
      }
      // for (const giaTri of giaTriThuocTinhList) {
      //   //const IDGiaTriThuocTinh= giaTri._id
      //   currentVariant[thuocTinh] = giaTri._id;
      //   await createVariants(product, [...thuocTinhs], { ...currentVariant });
      // }
    }
  };

  await createVariants(product, attributeIds);
  return product;
}

//code them thuoc tinh vao ben trong san pham

async function themThuocTinhVaGiaTri(req, res) {
  const { idSanPham, thuocTinhId, giaTriId } = req.body;
  try {
    // Tìm sản phẩm
    const sanPham = await SanPhamModel.findById(idSanPham);
    if (!sanPham) {
      return "Sản phẩm không tồn tại";
    }

    // Kiểm tra xem thuộc tính đã tồn tại trong sản phẩm chưa
    const thuocTinhDaTonTai = sanPham.thuocTinh.find(
      (t) => t.thuocTinh.toString() === thuocTinhId.toString()
    );
    if (thuocTinhDaTonTai) {
      // Kiểm tra xem giá trị đã tồn tại trong thuộc tính chưa
      const giaTriDaTonTai = thuocTinhDaTonTai.giaTri.find(
        (g) => g.toString() === giaTriId.toString()
      );
      if (giaTriDaTonTai) {
        return "Giá trị đã tồn tại cho thuộc tính này";
      } else {
        // Thêm giá trị vào thuộc tính
        thuocTinhDaTonTai.giaTri.push(giaTriId);
      }
    } else {
      // Thêm thuộc tính mới cho sản phẩm
      sanPham.thuocTinh.push({
        thuocTinh: thuocTinhId,
        giaTri: [giaTriId],
      });
    }

    // Lưu lại thay đổi
    await sanPham.save();
    return "Thêm thuộc tính và giá trị thành công";
  } catch (error) {
    console.error(error);
    return "Có lỗi xảy ra";
  }
}

async function createThuocTinhSanPham(req, res, next) {
  const { IDSanPham, ThuocTinhID } = req.body;

  try {
    // Tìm sản phẩm theo ID
    const sanPham = await SanPhamModel.findById(IDSanPham);
    if (!sanPham) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" }); // Trả về lỗi HTTP 404
    }

    // Thêm ThuocTinhID vào mảng DanhSachThuocTinh
    sanPham.DanhSachThuocTinh.push(ThuocTinhID);

    // Lưu thay đổi
    const sanPhamUpdated = await sanPham.save();

    return res.json(sanPhamUpdated); // Trả về sản phẩm đã cập nhật
  } catch (error) {
    console.error("Lỗi khi thêm thuộc tính:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" }); // Trả về lỗi HTTP 500
  }
}

//hamdequy
async function createbienthesanpham(req, res, next) {
  const { IDSanPham } = req.body;
  const projection = {
    _id: 0,
    GiaTri: 1,
    // Set chapters to null explicitly
  };
  const sanPham = await SanPhamModel.findById(IDSanPham);
  if (!sanPham) {
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" }); // Trả về lỗi HTTP 404
  }
  // Lấy danh sách ID thuộc tính
  let attributeValuesMap = {};
  const ThuocTinhID = sanPham.DanhSachThuocTinh;
  console.log(ThuocTinhID);
  for (let i = 0; i < ThuocTinhID.length; i++) {
    console.log(ThuocTinhID[i]); // In ra từng phần tử
    const thuocTinhgiatri = await ThuocTinhGiaTriModel.find(
      { ThuocTinhID: ThuocTinhID[i] },
      projection
    );
    attributeValuesMap[ThuocTinhID[i]] = thuocTinhgiatri;
  }
  console.log(attributeValuesMap);
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
      combinations.push(current.join(","));
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
  const { IDSanPham } = req.body;
  console.log(IDSanPham);
  try {
    const BienThe = await BienTheSchema.find({ IDSanPham: IDSanPham });
    res.status(200).json(BienThe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi truy xuat san pham" });
  }
}
//create biến thể sản phẩm chay , dự phòng
async function createBienTheFake(req, res, next) {
  const { IDSanPham, sku, gia, soLuong, KetHopThuocTinh } = req.body;
  try {
    // Kiểm tra xem ThuocTinhID đã tồn tại chưa
    // const existingThuocTinh = await SanPhamModel.findOne({ IDGiaTriThuocTinh });

    // if (existingThuocTinh) {
    //     return res.status(409).json({ message: 'Thuộc tính đã tồn tại' });
    // }

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

async function updateSanPham(req, res, next) {
  // const { ThuocTinhID } = req.params;
  const { IDGiaTriThuocTinh, GiaTri } = req.body;

  try {
    const updatedThuocTinhGiaTri = await SanPhamModel.findOneAndUpdate(
      { IDGiaTriThuocTinh },
      { GiaTri },
      { new: true }
    );

    if (!updatedThuocTinhGiaTri) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giá trị thuộc tính" });
    }

    res.status(200).json(updatedThuocTinhGiaTri);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi cập nhật giá trị thuộc tính" });
  }
}

async function deleteSanPham(req, res, next) {
  const { IDGiaTriThuocTinh } = req.params;

  try {
    const deletedThuocTinhGiaTri = await SanPhamModel.findOneAndDelete(
      IDGiaTriThuocTinh
    );

    if (!deletedThuocTinhGiaTri) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giá trị thuộc tính" });
    }

    res.status(200).json({ message: "Xóa thuộc giá trị tính thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi xóa giá trị thuộc tính" });
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

module.exports = {
  getlistSanPham,
  createSanPham,
  createSanPhamVoiBienThe,
  createThuocTinhSanPham,
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
};
