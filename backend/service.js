const axios = require("axios");
require("dotenv").config();

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
console.log(process.env.GROQ_API_KEY)
const askGroq = async (prompt) => {
  const res = await axios.post(
    GROQ_API_URL,
    {
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: "You are a helpful course assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.choices[0].message.content;
};

module.exports = { askGroq };
