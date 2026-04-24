const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

module.exports = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/collegeDB",
  nodeEnv: process.env.NODE_ENV || "development",
};
