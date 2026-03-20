const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },   // "YYYY-MM-DD"
  content: { type: String, required: true },
  mood_tag: { type: String, default: "neutral" }, // happy, sad, anxious, etc.
  updatedAt: { type: Date, default: Date.now },
});

journalSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Journal", journalSchema);