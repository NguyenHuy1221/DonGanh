const KhuyenMaiModel = require("../models/KhuyenMaiSchema");
const LoaiKhuyenMaiModel = require("../models/LoaiKhuyenMaiSchema")
require("dotenv").config();


//ham lay danh sach thuoc tinh
async function getlistKhuyenMai(req, res, next) {

    try {
        const khuyenmais = await KhuyenMaiModel.find();
        res.status(200).json(khuyenmais);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi tìm kiếm thuộc tính' });
    }
}



async function createKhuyenMai(req, res, next) {
    const { IDKhuyenMai, TenKhuyenMai, MoTa, GiaTriKhuyenMai, GioiHanSoLuong, GioiHanGiaTriDuocApDung, NgayBatDau, NgayKetThuc, soLuong, IDLoaiKhuyenMai, IDDanhMucCon, TrangThai } = req.body;

    try {
        const newKhuyenMai = new KhuyenMai({
            IDKhuyenMai,
            TenKhuyenMai,
            MoTa,
            GiaTriKhuyenMai,
            GioiHanSoLuong,
            GioiHanGiaTriDuocApDung,
            NgayBatDau,
            NgayKetThuc,
            soLuong,
            IDLoaiKhuyenMai,
            IDDanhMucCon,
            TrangThai
        });

        const savedKhuyenMai = await newKhuyenMai.save();
        res.status(201).json(savedKhuyenMai);
    } catch (error) {
        next(error);
    }
}

async function updateKhuyenMai(req, res, next) {
    const { id } = req.params;
    const { IDKhuyenMai, TenKhuyenMai, MoTa, GiaTriKhuyenMai, GioiHanSoLuong, GioiHanGiaTriDuocApDung, NgayBatDau, NgayKetThuc, soLuong, IDLoaiKhuyenMai, IDDanhMucCon, TrangThai } = req.body;

    try {
        const updatedKhuyenMai = await KhuyenMai.findByIdAndUpdate(
            id,
            {
                IDKhuyenMai,
                TenKhuyenMai,
                MoTa,
                GiaTriKhuyenMai,
                GioiHanSoLuong,
                GioiHanGiaTriDuocApDung,
                NgayBatDau,
                NgayKetThuc,
                soLuong,
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
        next(error);
    }
}
async function deleteKhuyenMai(req, res, next) {
    const { id } = req.params;

    try {
        const deletedKhuyenMai = await KhuyenMai.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );

        if (!deletedKhuyenMai) {
            return res.status(404).json({ message: 'Khuyến mãi không tồn tại' });
        }

        res.status(200).json({ message: 'Khuyến mãi đã được đánh dấu là đã xóa' });
    } catch (error) {
        next(error);
    }
}

async function getActiveKhuyenMai(req, res, next) {
    try {
        const activeKhuyenMai = await KhuyenMai.find({ isDeleted: false });
        res.status(200).json(activeKhuyenMai);
    } catch (error) {
        next(error);
    }
}





module.exports = {
    getlistKhuyenMai,
    createKhuyenMai,
    updateKhuyenMai,
    deleteKhuyenMai,
    getActiveKhuyenMai
};
