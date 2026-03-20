const express = require("express");
const router  = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM = `You are MindMate AI, a warm and caring mental wellness assistant for college students in placement season. Help with stress, interview prep, motivation, and relaxation. Be warm, concise, and encouraging. Never mention you are a language model.`;

router.post("/", authMiddleware, async (req, res) => {
  const { messages } = req.body;
  if (!messages) return res.status(400).json({ error: "messages is required" });

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user",   content: messages },
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Sorry, I couldn't respond right now. Please try again.";

    res.json({ reply });
  } catch (err) {
    console.error("Groq chat error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;