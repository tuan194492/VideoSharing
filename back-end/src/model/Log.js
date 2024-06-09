const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: false,
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
  },
  watchTime: {
    type: Number,
    required: false,
  }

}, {
    timestamps: true
});

const Log = mongoose.model("Log", LogSchema);

module.exports = { Log };
