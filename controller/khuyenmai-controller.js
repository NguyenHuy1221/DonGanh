const KhuyenMaiModel = require("../models/KhuyenMaiSchema");
const LoaiKhuyenMaiModel = require("../models/LoaiKhuyenMaiSchema")
require("dotenv").config();


//ham lay danh sach thuoc tinh
// async function getlistKhuyenMai(req, res, next) {

//     try {
//         const khuyenmais = await KhuyenMaiModel.find();
//         res.status(200).json(khuyenmais);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Lỗi khi get list khuyen mai' });
//     }
// }
//trangthai 1 tat ca san pham , trang thai 0 chi 1 san pham
async function getlistKhuyenMai(req, res, next) {
    try {
        const  {IDDanhMucCon}  = req.params;

        // Điều kiện tìm kiếm
        const conditions = {
            SoLuongHienTai: { $gt: 0 },
            $or: [
                { TrangThai: 0 },
                { IDDanhMucCon: IDDanhMucCon }
            ]
        };

        // Tạo query
        let query = KhuyenMaiModel.find(conditions);
        const khuyenmais = await query.exec();
        res.status(200).json(khuyenmais);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi get list khuyến mãi' });
    }
}

async function createKhuyenMai(req, res, next) {
    const {TenKhuyenMai, MoTa, GiaTriKhuyenMai, TongSoLuongDuocTao, GioiHanGiaTriDuocApDung, NgayBatDau, NgayKetThuc, SoLuongHienTai, IDLoaiKhuyenMai, IDDanhMucCon, TrangThai } = req.body;
    try {
        const newKhuyenMai = await KhuyenMaiModel.create({
            TenKhuyenMai,
            MoTa,
            GiaTriKhuyenMai,
            TongSoLuongDuocTao,
            GioiHanGiaTriDuocApDung,
            NgayBatDau,
            NgayKetThuc,
            SoLuongHienTai,
            IDLoaiKhuyenMai,
            IDDanhMucCon,
            TrangThai
        });


        res.status(201).json(newKhuyenMai);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi create khuyen mai' });
    }
}

async function updateKhuyenMai(req, res, next) {
    const { id } = req.params;
    const {  TenKhuyenMai, MoTa, GiaTriKhuyenMai, TongSoLuongDuocTao, GioiHanGiaTriDuocApDung, NgayBatDau, NgayKetThuc, SoLuongHienTai, IDLoaiKhuyenMai, IDDanhMucCon, TrangThai } = req.body;

    try {
        const updatedKhuyenMai = await KhuyenMaiModel.findByIdAndUpdate(
            id,
            {
                TenKhuyenMai,
                MoTa,
                GiaTriKhuyenMai,
                TongSoLuongDuocTao,
                GioiHanGiaTriDuocApDung,
                NgayBatDau,
                NgayKetThuc,
                SoLuongHienTai,
                IDLoaiKhuyenMai,
                IDDanhMucCon,
                TrangThai
            },
            { new: true }
        );

        if (!updatedKhuyenMai) {
            return res.status(404).json({ message: 'Khuyến mãi không tồn tại' });
        }

        res.status(200).json(updatedKhuyenMai);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi update khuyen mai' });
    }
}
async function deleteKhuyenMai(req, res, next) {
    const { id } = req.params;

    try {
        const deletedKhuyenMai = await KhuyenMaiModel.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );

        if (!deletedKhuyenMai) {
            return res.status(404).json({ message: 'Khuyến mãi không tồn tại' });
        }

        res.status(200).json({ message: 'Khuyến mãi đã được đánh dấu là đã xóa' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xoa khuyen mai' });
    }
}

async function getActiveKhuyenMai(req, res, next) {
    try {
        const activeKhuyenMai = await KhuyenMaiModel.find({ isDeleted: false });
        res.status(200).json(activeKhuyenMai);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi tìm kiếm thuộc tính' });
    }
}





module.exports = {
    getlistKhuyenMai,
    createKhuyenMai,
    updateKhuyenMai,
    deleteKhuyenMai,
    getActiveKhuyenMai
};
