const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {type: String,enum: ['TEST_USER', 'TEACHER', 'MASTER'], required : true},
});
module.exports = mongoose.model('RootUser', userSchema);
