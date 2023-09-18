const mongoose = require("mongoose");

const RecommendPointsSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  videoId: {
    type: Number,
    required: true,
  },
  point: {
    type: Number,
    required: true,
  }
}, {
    timestamps: true
});

const RecommendPoints = mongoose.model("RecommendPoints", RecommendPointsSchema);

module.exports = { RecommendPoints };