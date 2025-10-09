import { Router } from "express";
import { createPrompt } from "../prompt.js";
import { updateTranslation } from "../transifex.js";

const router = Router();

router.post("/ask", async (req, res) => {
  try {
    const { question, resource, stringHash } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }
    if (!resource || !stringHash) {
      return res.status(400).json({ error: "resource and stringHash are required" });
    }

    // Step 1. Build the translation request for the LLM
    const translationRequest = createPrompt(question);

    // Step 2. Call Mistral API
    const mistralResp = await fetch("https://api.mistral.ai/v1/chat/completions", {
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

    const mistralData = await mistralResp.json();
    const translatedString = mistralData.choices?.[0]?.message?.content;

    if (!translatedString) {
      return res.status(500).json({ error: "No translation returned by LLM" });
    }

    // Step 3. Update Transifex with the new translation
    const updateResponse = await updateTranslation({
      translatedString,
      resource,
      stringHash
    });

    // Step 4. Respond with both the translation and Transifex confirmation
    res.json({
      answer: translatedString,
      transifex: updateResponse
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process translation request" });
  }
});

export default router;
