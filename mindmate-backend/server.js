const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authMiddleware = require("./middleware/authMiddleware");

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://mindmate.vercel.app"
  ],
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ─── Routes ───────────────────────────────────────────
app.use("/api/auth",    require("./routes/authRoutes"));
app.use("/api/mood",    require("./routes/moodRoutes"));
app.use("/api/stress",  require("./routes/stressRoutes"));
app.use("/api/journal", require("./routes/journalRoutes"));
app.use("/api/chat",    require("./routes/chatRoutes"));
app.use("/api/affirmations", require("./routes/affirmationRoutes"));
// ─── Dashboard summary ────────────────────────────────
app.get("/api/dashboard", authMiddleware, async (req, res) => {
  try {
    const Mood   = require("./models/Mood");
    const Stress = require("./models/Stress");
    const userId = req.user.id;

    const moodCount     = await Mood.countDocuments({ userId });
    const stressEntries = await Stress.find({ userId });
    const stressCount   = stressEntries.length;
    const avgStress     =
      stressCount > 0
        ? (stressEntries.reduce((sum, e) => sum + e.score, 0) / stressCount).toFixed(1)
        : 0;

    res.json({ message: "Welcome to MindMate Dashboard", moodCount, stressCount, avgStress });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// ─── Health check ─────────────────────────────────────
app.get("/", (req, res) => res.send("MindMate API Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));