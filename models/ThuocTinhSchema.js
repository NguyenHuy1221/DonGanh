const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThuocTinhSchema = new Schema({
  IDThuocTinh: { type: String, required: true, unique: true }, // Khóa chính, duy nhất
  TenThuocTinh: { type: String, required: true },
});

const ThuocTinh = mongoose.model('ThuocTinh', ThuocTinhSchema);

module.exports = ThuocTinh;