require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());            // allow localhost frontend
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    // Simple Responses API call
    const r = await client.responses.create({
      model: "gpt-4o-mini",
      input: `Answer clearly and briefly.\n\nUser: ${prompt}`,
      max_output_tokens: 500,
      temperature: 0.2,
    });

    res.json({ reply: (r.output_text || "").trim() });
  } catch (err) {
    console.error("OpenAI error:", err.response?.data || err);
    res
      .status(err.status || 500)
      .json({ error: err.response?.data?.error?.message || err.message || "OpenAI request failed" });
  }
});

const PORT = process.env.PORT || 8085;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
