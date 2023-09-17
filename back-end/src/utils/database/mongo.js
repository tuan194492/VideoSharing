const mongoose = require("mongoose");

const connectMongoDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/VideoSharing");
    console.log("Connect to mongo DB successful");
  } catch (error) {
    console.log("Connect to mongo DB fail");
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectMongoDB;
