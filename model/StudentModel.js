const mongoose = require('mongoose')
const studentSchema = new mongoose.Schema({
  name: { type: String, require: true },
  section:{type:String},
  rollNo:{type:Number,require:true},
  DOB:{type:Date,require:true},
  Class:{type:Number,require:true},
  parentsPhone:{type:Number,require:true}
})

module.exports = mongoose.model('Student', studentSchema);
