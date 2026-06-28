const express = require("express");
const router = express.Router();
const axios = require("axios");

require("dotenv").config();

router.get("/generate/:topic", async (req, res) => {
  try {
    let topic = req.params.topic;
    const difficulty = req.query.difficulty || "easy";

    // ✅ HANDLE WEAK TOPICS PROPERLY
    if (topic === "weak") {
      try {
        const weakRes = await axios.get("http://localhost:5000/api/quiz/weak");
        const weakTopics = weakRes.data.weakTopics;

        if (weakTopics && weakTopics.length > 0) {
          topic = weakTopics.join(", ");
        } else {
          topic = "Database Management Systems";
        }
      } catch (err) {
        console.log("Error fetching weak topics");
        topic = "Database Management Systems";
      }
    }

    // ✅ STRONG PROMPT (MAIN FIX)
    const prompt = `
You are a Database Management Systems (DBMS) expert.

Generate 5 ${difficulty.toUpperCase()} level MCQ questions STRICTLY from:
${topic}

STRICT RULES:
- Subject MUST be DBMS only
- DO NOT generate English/vocabulary questions
- DO NOT interpret words like "weak"
- Focus on: SQL, normalization, indexing, keys, transactions, ER models
- Each question must have 4 options
- Only ONE correct answer
- Provide answerIndex (0-3)
- Provide a clear explanation

Return ONLY JSON:
[
  {
    "question": "Question text",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "answerIndex": 0,
    "explanation": "Explanation"
  }
]
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You generate strictly DBMS quizzes in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7   // 🔥 reduced randomness
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let text = response.data.choices[0].message.content;

    // clean markdown
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let quiz;

    try {
      quiz = JSON.parse(text);
    } catch (err) {
      console.log("JSON PARSE ERROR:", text);
      return res.json({ quiz: [] });
    }

    // ✅ SAFE MAPPING
    quiz = quiz.map((q) => {
      let answerIndex = Number(q.answerIndex);

      if (isNaN(answerIndex) || answerIndex < 0 || answerIndex > 3) {
        answerIndex = 0;
      }

      const labeledOptions = q.options.map((opt, index) => {
        const letter = ["A", "B", "C", "D"][index];
        return `${letter}. ${opt}`;
      });

      let explanation = q.explanation;
      if (!explanation || explanation.trim() === "") {
        explanation = `The correct answer is "${q.options[answerIndex]}".`;
      }

      return {
        question: q.question,
        options: labeledOptions,
        answerIndex,
        explanation
      };
    });

    res.json({ quiz });

  } catch (error) {
    console.error("QUIZ ERROR:", error.response?.data || error.message);
    res.json({ quiz: [] });
  }
});

module.exports = router;