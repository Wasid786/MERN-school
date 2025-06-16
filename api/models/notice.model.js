const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
    school: {type : mongoose.Schema.ObjectId, ref: "School"},
    title: {type: String, require: true}, 
    message: {type: String, require: true}, 
    audience: {type:String,  enum:[`student`, `teacher`], require: true}, 
      createAt: {type:Date,default:new Date()}
    

})

module.exports = mongoose.model("Notice", noticeSchema)