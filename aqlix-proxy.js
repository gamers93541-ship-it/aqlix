// Aqlix OpenAI Secure Proxy
// حماية مفتاح OpenAI من الظهور في واجهة التطبيق

import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ضع مفتاح OpenAI في متغير البيئة
const OPENAI_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
  try {
    const { messages, model = "gpt-4o-mini" } = req.body;
    if (!OPENAI_KEY) {
      return res.status(500).json({ error: "OpenAI key not set on server." });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 400
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Aqlix proxy running on port ${PORT}`));
