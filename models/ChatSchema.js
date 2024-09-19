const mongoose = require("mongoose");
const { Schema } = mongoose;
const {convertToVietnamTimezone} = require('../middleware/index');
const ChatSchema = new Schema({
 
  sender_id:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver_id:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: {type:String,required:true},
},{
  timestamps:true
});
convertToVietnamTimezone(ChatSchema)
module.exports = mongoose.model("Chat", ChatSchema);