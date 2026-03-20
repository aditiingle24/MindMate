const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Journal = require("../models/Journal");

// Save or update today's journal
router.post("/", authMiddleware, async (req, res) => {
  const { content, mood_tag } = req.body;
  if (!content) return res.status(400).json({ error: "Content is required" });

  const today = req.body.date || new Date().toISOString().split("T")[0];

  try {
    let entry = await Journal.findOneAndUpdate(
      { userId: req.user.id, date: today },
      { content, mood_tag, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all journal entries for the user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const entries = await Journal.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(30);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific date's entry
router.get("/:date", authMiddleware, async (req, res) => {
  try {
    const entry = await Journal.findOne({
      userId: req.user.id,
      date: req.params.date,
    });
    res.json(entry || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an entry
router.delete("/:date", authMiddleware, async (req, res) => {
  try {
    await Journal.findOneAndDelete({ userId: req.user.id, date: req.params.date });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;