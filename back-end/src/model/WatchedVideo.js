const mongoose = require("mongoose");

const WatchedVideoSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  videoId: {
    type: Number,
    required: true,
  },
  timeWatched: {
    type: Number,
    required: true,
  }
}, {
    timestamps: true
});

const WatchedVideo = mongoose.model("WatchedVideo", WatchedVideoSchema);

module.exports = { WatchedVideo };