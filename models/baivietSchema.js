const mongoose = require('mongoose');
const { Schema } = mongoose;

const BaiVietSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String },
    tieude: { type: String, required: true },
    noidung: { type: String, required: true },
    likes: { type: Number, default: 0 },
    binhluan: [{ type: Schema.Types.ObjectId, ref: 'binhluanbaiviet' }],
    tags: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const BaiViet = mongoose.model('BaiViet', BaiVietSchema);
module.exports = BaiViet;
