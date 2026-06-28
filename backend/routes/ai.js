const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require('../db/connection');
require("dotenv").config();

console.log("GROQ API KEY:", process.env.GROQ_API_KEY ? "Loaded ✅" : "MISSING ❌");

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ reply: "Please provide a valid message." });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI learning assistant for college students. Answer questions clearly and academically."
          },
          {
            role: "user",
            content: message.trim()
          }
        ],
        max_tokens: 1024,
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("FULL ERROR:", JSON.stringify(error.response?.data, null, 2) || error.message);
    res.status(500).json({
      reply: "AI is temporarily unavailable. Please try again later."
    });
  }
});

// GET AI GENERATED CONTENT
router.get("/content", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        content_id AS id,
        content_type,
        content_text AS content,
        is_approved
      FROM ai_generated_content
    `);

    console.log("ROWS:", rows);
    res.json(rows);
  } catch (err) {
    console.log("ERROR:", err);
    res.json([]);
  }
});

// UPDATE STATUS
router.post("/content/status", async (req, res) => {
  const { id, status } = req.body;

  try {
    await db.query(
      "UPDATE ai_generated_content SET is_approved = ? WHERE content_id = ?",
      [status === "approved" ? 1 : 0, id]
    );

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

module.exports = router;