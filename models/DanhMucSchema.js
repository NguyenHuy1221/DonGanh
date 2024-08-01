const mongoose = require("mongoose");
const { Schema } = mongoose;

const DanhMucConSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true }, // ID của danh mục con
    TenDanhMucCon: { type: String, required: true },
    MieuTa: String
  });
  
  const DanhMucSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    IDDanhMuc: { type: String, required: true, unique: true }, // Nếu cần ID tùy chỉnh
    TenDanhMuc: { type: String, required: true },
    DanhMucCon: [DanhMucConSchema] // Sử dụng reference nếu cần
  });

module.exports = mongoose.model("DanhMuc", DanhMucSchema);