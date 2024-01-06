const mongoose = require('mongoose');
const uri =
    "mongodb+srv://fardindeveloper1:Fardin379@cluster0.wjeazsk.mongodb.net/tesy";
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }

  module.exports = connectDB;

