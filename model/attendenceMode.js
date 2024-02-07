const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'inComplete'],
    default: 'absent',
    required: true,
  },
  morningStatus: {
    type: Boolean,
    default: false,
    required: true,
  },
  evengStatus: {
    type: Boolean,
    default: false,
    required: true,
  },
  lateMinutes: {
    type: Number,
    default: 0,
    require: true
  },
  earlydepartureMinute: {
    type: Number,
    default: 0,
    require: true
  }
});

// AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });


module.exports = mongoose.model('Attendance', AttendanceSchema);
