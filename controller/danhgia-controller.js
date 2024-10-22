const DanhGiamodel = require("../models/DanhGiaSchema");
const LoaiKhuyenMaiModel = require("../models/LoaiKhuyenMaiSchema")
require("dotenv").config();
const { upload } = require("../untils/index");
const fs = require('fs');
//ham lay danh sach thuoc tinh
// async function getListDanhGiaInSanPhamById(req, res, next) {
//     const { IDSanPham } = req.params;
//     try {
//         const Danhgias = await DanhGiamodel.find({ sanphamId: IDSanPham }).populate("userId");
//         res.status(200).json(Danhgias);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Lỗi khi lấy danh sách đánh giá' });
//     }
// }

async function getListDanhGiaInSanPhamById(req, res, next) {
    const { IDSanPham, userId } = req.params;

    try {
        const Danhgias = await DanhGiamodel.find({ sanphamId: IDSanPham })
            .populate("userId")
            .populate({
                path: 'likes',
                match: { userId: userId } // Chỉ lấy những like của người dùng hiện tại
            });

        // Thêm trường isLiked vào mỗi đối tượng đánh giá để chỉ ra người dùng đã like hay chưa
        const danhGiasWithLikeInfo = Danhgias.map(danhGia => {
            const isLiked = danhGia.likes.some(like => like.userId.toString() === userId.toString());
            return { ...danhGia._doc, isLiked };
        });

        res.status(200).json(danhGiasWithLikeInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách đánh giá' });
    }
}

async function createDanhGia(req, res) {
    try {
        await upload.single('file')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'Error uploading image', error: err });
            }
            const { userId, sanphamId, XepHang, BinhLuan } = req.body;

            // const hinhAnh = req.file ? req.file.path.replace('public', process.env.URL_IMAGE) : null;

            const newDanhGia = new DanhGiamodel({
                userId,
                sanphamId,
                XepHang,
                BinhLuan,
                NgayTao: new Date()
            });
            if (req.file) {
                // Lưu đường dẫn ảnh vào cơ sở dữ liệu
                newDanhGia.HinhAnh = req.file.path.replace('public', process.env.URL_IMAGE);
            }
            await newDanhGia.save();
            res.status(201).json(newDanhGia);
        });
    } catch (error) {
        console.error('Lỗi khi tạo đánh giá:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo đánh giá' });
    }
}

async function updateDanhGia(req, res) {
    try {
        await upload.single('file')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'Error uploading image', error: err });
            }
            const { danhGiaId } = req.params;
            const { XepHang, BinhLuan } = req.body;
            // const hinhAnh = req.file ? req.file.path.replace('public', process.env.URL_IMAGE) : null;

            const updatedDanhGia = await DanhGiamodel.findByIdAndUpdate(
                danhGiaId,
                { HinhAnh: hinhAnh, XepHang, BinhLuan, NgayTao: new Date() },
                { new: true }
            );

            if (!updatedDanhGia) {
                return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
            }
            if (req.file) {
                // Xóa ảnh cũ (nếu có)
                if (updatedDanhGia.HinhAnh) {
                    // Hàm xóa ảnh dựa trên đường dẫn
                    await deleteImage(updatedDanhGia.HinhAnh);
                }
                // Cập nhật đường dẫn ảnh mới
                updatedDanhGia.HinhAnh = req.file.path.replace('public', process.env.URL_IMAGE);
            }
            res.status(200).json(updatedDanhGia);
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật đánh giá:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật đánh giá' });
    }
}


async function updateLike(req, res) {
    try {
        const { phanHoiId, userId } = req.params;
        const updatedDanhGia = await DanhGiamodel.findOneAndUpdate({ _id: phanHoiId, userId, userId }, {
            $push: { likes: userId }, // Add user ID to likes array
        })

        if (!updatedDanhGia) {
            return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
        }

        res.status(200).json(updatedDanhGia);

    } catch (error) {
        console.error('Lỗi khi cập nhật đánh giá:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật đánh giá' });
    }
}


async function deleteDanhGia(req, res) {
    try {
        const { sanphamId, danhGiaId } = req.params;

        const deletedDanhGia = await DanhGiamodel.findByIdAndDelete(danhGiaId);

        if (!deletedDanhGia) {
            return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
        }
        if (deletedDanhGia.HinhAnh) {
            await deleteImage(deletedDanhGia.HinhAnh);
        }
        const Danhgias = await DanhGiamodel.find({ sanphamId: sanphamId });
        res.status(200).json(Danhgias);
    } catch (error) {
        console.error('Lỗi khi xóa đánh giá:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa đánh giá' });
    }
}
async function addPhanHoi(req, res) {
    try {
        const { danhGiaId } = req.params;
        const { userId, BinhLuan } = req.body;

        const danhGia = await DanhGiamodel.findById(danhGiaId);

        if (!danhGia) {
            return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
        }

        danhGia.PhanHoi.push({
            userId,
            BinhLuan,
            NgayTao: new Date()
        });

        await danhGia.save();

        res.status(201).json(danhGia);
    } catch (error) {
        console.error('Lỗi khi thêm phản hồi:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm phản hồi' });
    }
}
async function updatePhanHoi(req, res) {
    try {
        const { danhGiaId, phanHoiId } = req.params;
        const { BinhLuan } = req.body;

        const danhGia = await DanhGiamodel.findById(danhGiaId);

        if (!danhGia) {
            return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
        }

        const phanHoi = danhGia.PhanHoi.id(phanHoiId);
        if (!phanHoi) {
            return res.status(404).json({ message: 'Không tìm thấy phản hồi' });
        }

        phanHoi.BinhLuan = BinhLuan;
        phanHoi.NgayTao = new Date();

        await danhGia.save();

        res.status(200).json(danhGia);
    } catch (error) {
        console.error('Lỗi khi cập nhật phản hồi:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật phản hồi' });
    }
}
async function deletePhanHoi(req, res) {
    try {
        const { danhGiaId, phanHoiId } = req.params;

        const danhGia = await DanhGiamodel.findById(danhGiaId);

        if (!danhGia) {
            return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
        }

        const phanHoi = danhGia.PhanHoi.id(phanHoiId);
        if (!phanHoi) {
            return res.status(404).json({ message: 'Không tìm thấy phản hồi' });
        }

        phanHoi.remove();

        await danhGia.save();

        res.status(200).json(danhGia);
    } catch (error) {
        console.error('Lỗi khi xóa phản hồi:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa phản hồi' });
    }
}
async function deleteImage(imageUrl) {
    try {
        const parts = imageUrl.split('/');
        const imageName = parts[parts.length - 1]; // Lấy tên file
        const imagePath = path.join(__dirname, 'uploads', imageName);
        fs.unlinkSync(imagePath);
        console.log('Ảnh đã được xóa thành công.');
    } catch (error) {
        console.error('Lỗi khi xóa ảnh:', error);
    }
}
module.exports = {
    getListDanhGiaInSanPhamById,
    createDanhGia,
    updateDanhGia,
    deleteDanhGia,
    addPhanHoi,
    updatePhanHoi,
    deletePhanHoi,
    updateLike,
};
