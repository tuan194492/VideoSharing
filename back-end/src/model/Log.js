const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  videoId: {
    type: Number,
    required: true,
  },
  channelId: {
    type: Number,
    required: true,
  }

}, {
    timestamps: true
});

const Log = mongoose.model("Log", LogSchema);

module.exports = { Log };
