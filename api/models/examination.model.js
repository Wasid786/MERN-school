const mongoose = require('mongoose')
const examinationSchema = new mongoose.Schema({
    school: {type:mongoose.Schema.ObjectId, ref: 'School'},
        examDate: {type:Date, require: true},
     subject: {type:mongoose.Schema.ObjectId, ref: 'Subject'},
         examType: {type:String, require: true},
      class: {type:mongoose.Schema.ObjectId, ref: 'Class'},
      createAt: {type:Date,default:new Date()}


})

module.exports = mongoose.model("Examination", examinationSchema) 