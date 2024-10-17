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
    let conversation = await ConversationModel.find({ sender_id });
    if (!conversation) {
      res.status(200).json({ message: "khong co cuoc hoi thoai nao" });
    }
    res.status(200).json(conversation);
  } catch (error) {
    console.error('Lỗi khi tạo conversation:', error);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
}

module.exports = {
  Createconversation,
  getlistconversation,
};
