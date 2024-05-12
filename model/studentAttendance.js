const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema([{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  classnumber:{
    type:Number,
    required:true
  },
  section:{
    type:String,
    required:true
  },
  rollNo:{
    type:String,
    required:true
  },
  count:{
    type:Number,
    required:true
  },
  date: {
    type: Date,
    required: true,
    default:Date.now()
  }
  
}]);

AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });


module.exports = mongoose.model('studentAttendance', AttendanceSchema);
