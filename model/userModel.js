const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
  dateOfJoin: {
    type: Date,
    required: true,
  },
  baseSalary:Number,
  netLeave:Number
});

module.exports = mongoose.model('User', UserSchema);