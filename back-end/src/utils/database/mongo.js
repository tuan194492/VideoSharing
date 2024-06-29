const mongoose = require("mongoose");
require('dotenv').config();

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connect to MongoDB successful");
  } catch (error) {
    console.log("Connect to MongoDB failed");
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectMongoDB;
