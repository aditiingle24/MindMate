const express      = require("express");
const router       = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Affirmation  = require("../models/Affirmation");

const MAX_RECORDINGS = 3;

// GET all affirmations for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const items = await Affirmation.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select("-audioData"); // don't send audio in list, fetch individually
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single affirmation with audio data
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Affirmation.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST save a new affirmation
router.post("/", authMiddleware, async (req, res) => {
  const { title, audioData, duration } = req.body;

  if (!title || !audioData || !duration) {
    return res.status(400).json({ error: "title, audioData and duration are required" });
  }

  if (duration > 30) {
    return res.status(400).json({ error: "Recording must be 30 seconds or less" });
  }

  try {
    // Check limit
    const count = await Affirmation.countDocuments({ userId: req.user.id });
    if (count >= MAX_RECORDINGS) {
      return res.status(400).json({
        error: `You can only save ${MAX_RECORDINGS} affirmations. Please delete one first.`,
        limitReached: true,
      });
    }

    const item = await Affirmation.create({
      userId:    req.user.id,
      title:     title.trim(),
      audioData,
      duration,
    });

    res.status(201).json({ success: true, _id: item._id, title: item.title, duration: item.duration });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE an affirmation
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Affirmation.findOneAndDelete({
      _id:    req.params.id,
      userId: req.user.id,
    });
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;