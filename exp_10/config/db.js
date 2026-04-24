const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
