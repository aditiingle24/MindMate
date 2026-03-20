const mongoose = require("mongoose");

const stressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answers: {
    type: [Number], // array of 0/1/2 per question
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  level: {
    type: String,
    enum: ["Low", "Moderate", "High"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Stress", stressSchema);