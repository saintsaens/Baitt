import { Router } from "express";
import { Mistral } from "@mistralai/mistralai";

const router = Router();

// Create a client with API key from env
const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

router.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    const translationRequest = `Translate to French (just strictly translate; no comment): ${question}`;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const resp = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [{ role: "user", content: translationRequest }]
      })
    });

    const data = await resp.json();
    res.json({ answer: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to query LLM" });
  }
});

export default router;
