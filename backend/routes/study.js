console.log("STUDY ROUTE LOADED");
const express = require("express");
const router = express.Router();
const axios = require("axios");

require("dotenv").config();

router.post("/", async (req, res) => {
      console.log("STUDY API HIT");   // 🔥 ADD THIS
  try {
    const { weakTopics } = req.body;

    const prompt = `
Create a 3-day study plan for:
${weakTopics.join(", ")}

Keep it short and structured.
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    res.json({
      plan: response.data.choices[0].message.content
    });

  } catch (err) {
    console.log(err);
    res.json({ plan: "Error generating plan" });
  }
});

module.exports = router;