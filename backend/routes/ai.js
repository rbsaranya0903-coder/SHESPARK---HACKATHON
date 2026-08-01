const express = require('express');
const axios = require('axios');
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

// Helper to call Gemini REST API
async function callGemini(prompt, base64Image, mimeType) {
  try {
    const parts = [{ text: prompt }];
    
    if (base64Image && mimeType) {
      // Clean base64 string if it includes data URI prefix
      const base64Data = base64Image.includes('base64,') ? base64Image.split('base64,')[1] : base64Image;
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    }

    const payload = {
      contents: [{ parts }]
    };
    
    const response = await axios.post(GEMINI_URL, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    const text = response.data.candidates[0].content.parts[0].text;
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error.response ? JSON.stringify(error.response.data) : error.message);
    throw new Error('Failed to generate AI response');
  }
}

// Endpoint for general Chatbot
router.post('/chat', async (req, res) => {
  try {
    const { message, company } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const systemPrompt = `You are BrandSphere AI, an expert brand strategist bot. The user is asking about the brand "${company || 'Acme Corporation'}". Keep answers extremely concise, helpful, and formatted in markdown.`;
    const fullPrompt = `${systemPrompt}\n\nUser Message: ${message}`;
    
    const reply = await callGemini(fullPrompt);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for Evaluate Content
router.post('/evaluate', async (req, res) => {
  try {
    const { company, fileName, imageBase64, mimeType } = req.body;
    
    const prompt = `You are BrandSphere AI, evaluating an uploaded asset named "${fileName}" for the brand "${company || 'Acme Corporation'}". 
    Analyze the provided image in the context of the brand.
    Point out 1 positive aspect and 1 negative aspect (e.g. typography or color mismatch) that violates the brand guidelines. 
    Keep it to 2-3 short sentences. Be professional and specific about what you see in the image.`;
    
    const reply = await callGemini(prompt, imageBase64, mimeType);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
