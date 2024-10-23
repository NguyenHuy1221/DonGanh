const ConversationModel = require("../models/ConversationSchema");
require("dotenv").config();


//ham lay danh sach bien the
async function Createconversation(req, res, next) {
  try {
    const { sender_id, receiver_id } = req.body;
    // Kiểm tra xem conversation đã tồn tại chưa
    let conversation = await ConversationModel.findOne({ sender_id, receiver_id });
    if (!conversation) {
      conversation = new ConversationModel({ sender_id, receiver_id });
      await conversation.save();
    }
    res.status(200).json(conversation);
  } catch (error) {
    console.error('Lỗi khi tạo conversation:', error);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
}
async function getlistconversation(req, res, next) {
  try {
    const { sender_id } = req.params;
    // Kiểm tra xem conversation đã tồn tại chưa
    let conversation = await ConversationModel.find({ $or: [{ sender_id: sender_id }, { receiver_id: sender_id }] });
    console.log("danh sach tin nhan")
    if (!conversation) {
      res.status(200).json({ message: "khong co cuoc hoi thoai nao" });
    }
    res.status(200).json(conversation);
  } catch (error) {
    console.error('Lỗi khi tạo conversation:', error);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
}

async function getlistconversation12(req, res, next) {
  try {
    const { sender_id } = req.params;

    // Kiểm tra xem conversation đã tồn tại chưa
    let conversations = await ConversationModel.find({
      $or: [{ sender_id: sender_id }, { receiver_id: sender_id }]
    }).populate('messages'); // Sử dụng populate để lấy thông tin tin nhắn

    if (conversations.length === 0) {
      return res.status(200).json({ message: "Không có cuộc hội thoại nào" });
    }
    
    res.status(200).json(conversations);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách cuộc hội thoại:', error);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
}

module.exports = {
  Createconversation,
  getlistconversation,
  getlistconversation12
};
