const express = require("express");
const router = express.Router();
const Mood = require("../models/Mood");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/mood  — log a mood entry
router.post("/", authMiddleware, async (req, res) => {
  const { mood, note } = req.body;

  if (!mood) {
    return res.status(400).json({ message: "Mood is required" });
  }

  try {
    const entry = await Mood.create({
      userId: req.user.id,
      mood,
      note: note || "",
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// GET /api/mood  — get all mood entries for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const entries = await Mood.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// DELETE /api/mood/:id  — delete a specific mood entry
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const entry = await Mood.findOne({ _id: req.params.id, userId: req.user.id });
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    await entry.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

module.exports = router;