const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { generatePrompts } = require("./utils/promptTemplate");
const { askGroq } = require("./service");

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Course generation backend is running!");
});

app.post("/generate-course", async (req, res) => {
  const { topic, goal, style, time, prior, device, level } = req.body;

  if (!topic || !goal || !prior || !level) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const prompts = generatePrompts({ topic, goal, style, time, prior, device, level });

  try {
    const [outline, content, videos, quizzes] = await Promise.all([
      askGroq(prompts.outlinePrompt),
      askGroq(prompts.contentPrompt),
      askGroq(prompts.videoPrompt),
      askGroq(prompts.quizPrompt),
    ]);

    res.json({ outline, content, videos, quizzes });
  } catch (err) {
    console.error("Error generating course:", err.message);
    res.status(500).json({ error: "Failed to generate course content." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
