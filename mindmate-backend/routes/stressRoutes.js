const express = require("express");
const router = express.Router();
const Stress = require("../models/Stress");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/stress  — submit a stress check quiz result
router.post("/", authMiddleware, async (req, res) => {
  const { answers, score } = req.body;

  if (answers === undefined || score === undefined) {
    return res.status(400).json({ message: "answers and score are required" });
  }

  let level;
  if (score <= 4) level = "Low";
  else if (score <= 8) level = "Moderate";
  else level = "High";

  try {
    const entry = await Stress.create({
      userId: req.user.id,
      answers,
      score,
      level,
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// GET /api/stress  — get all stress checks for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const entries = await Stress.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

module.exports = router;