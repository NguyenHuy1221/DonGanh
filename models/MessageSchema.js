const mongoose = require("mongoose");
const { Schema } = mongoose;
const {convertToVietnamTimezone} = require('../middleware/index');
const MessageSchema = new Schema({
  text: {type:String,required:true},
  imageUrl: {type:String,required:true},
  videoUrl: {type:String,required:true},
  seen: {type:Boolean,default : false},
  msgByUserId : {
      type : mongoose.Schema.ObjectId,
      required : true,
      ref : 'User'
  }
},{
  timestamps:true
});
convertToVietnamTimezone(MessageSchema)
module.exports = mongoose.model("Message", MessageSchema);