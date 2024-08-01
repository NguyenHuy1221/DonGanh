const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Schema cho biến thể sản phẩm
const BienTheSchema = new Schema({
    _id: Schema.Types.ObjectId,
    idSanPham: { type: Schema.Types.ObjectId, ref: 'SanPham' }, // Giả sử có một schema SanPham
    sku: String,
    gia: Number,
    soLuong: Number,
    ketHopThuocTinh: [{
      type: Schema.Types.ObjectId,
      ref: 'GiaTriThuocTinh'
    }]
  });

  const BienThe = mongoose.model('BienThe', BienTheSchema);

module.exports = BienThe; 