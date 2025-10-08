import { Router } from "express";
import { Mistral } from "@mistralai/mistralai";
import { createPrompt } from "./prompt.js";

const router = Router();

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }
    const translationRequest = createPrompt(question);

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
