const mongoose = require("mongoose");

const affirmationSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title:     { type: String, required: true, trim: true },
  audioData: { type: String, required: true }, // Base64 encoded audio
  duration:  { type: Number, required: true },  // seconds
  createdAt: { type: Date, default: Date.now },
});

// Max 3 recordings per user (enforced in route)
affirmationSchema.index({ userId: 1 });

module.exports = mongoose.model("Affirmation", affirmationSchema);