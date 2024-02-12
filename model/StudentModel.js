const mongoose = require('mongoose')
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  section: { type: String, required: true, default: 'none' },
  rollNo: { type: Number, required: true },
  DOB: { type: Date, require: true },
  Class: { type: Number, required: true },
  parentsPhone: { type: Number, required: true },
  due: {
    type: String,
    enum: ['paid', 'unpaid', 'considered'],
    default: 'unpaid',
    required: true
  }
})

module.exports = mongoose.model('Student', studentSchema)
