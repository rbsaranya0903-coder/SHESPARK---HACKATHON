const express = require('express');
const axios = require('axios');
const db = require('../db/database');
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`;

// Helper to call Gemini REST API
async function callGemini(prompt, base64Image, mimeType) {
  try {
    const parts = [{ text: prompt }];
    
    if (base64Image && mimeType) {
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

// Helper to fetch and build brand context from DB
async function getBrandContext(companyName) {
  if (!companyName) return '';
  try {
    const profile = await db.get(`SELECT * FROM organization_profile WHERE company_name = ? ORDER BY created_at DESC LIMIT 1`, [companyName]);
    if (!profile) return '';

    let brandDetails = {};
    if (profile.brand_details) {
      try { brandDetails = JSON.parse(profile.brand_details); } catch (e) {}
    }

    return `
--- BRAND DNA CONTEXT FOR ${companyName.toUpperCase()} ---
Industry: ${profile.industry || 'Unknown'}
Target Audience: ${profile.target_audience || brandDetails.target_audience || 'General'}
Mission: ${brandDetails.mission || 'N/A'}
Vision: ${brandDetails.vision || 'N/A'}
Brand USP: ${brandDetails.brand_usp || 'N/A'}
Brand Voice/Tone: ${brandDetails.selected_voices ? brandDetails.selected_voices.join(', ') : 'Professional'}
Words to Use: ${brandDetails.words_to_use || 'None specified'}
Words to Avoid: ${brandDetails.words_to_avoid || 'None specified'}
--------------------------------------------------
`;
  } catch (error) {
    console.error("Error fetching brand context:", error);
    return '';
  }
}

// Endpoint for general Chatbot
router.post('/chat', async (req, res) => {
  try {
    const { message, company } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const brandContext = await getBrandContext(company);
    const systemPrompt = `You are BrandSphere AI, an expert brand strategist bot. The user is asking about the brand "${company || 'Acme Corporation'}". Keep answers extremely concise, helpful, and formatted in markdown.\n\n${brandContext}`;
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
    
    const brandContext = await getBrandContext(company);
    const prompt = `You are BrandSphere AI, evaluating an uploaded asset named "${fileName}" for the brand "${company || 'Acme Corporation'}". 
    Analyze the provided content in the context of the brand details below. If it's a document instead of an image, infer its contents from its filename.
    
    ${brandContext}
    
    CRITICAL: Cross-check this content against likely competitors in the industry. Has a competitor recently used a highly similar campaign or visual style? If so, warn the user explicitly.
    
    You MUST output your evaluation strictly as a JSON object with the following structure (do not include markdown codeblocks around the JSON):
    {
      "score": "85% - Strong alignment with core values.",
      "status": "Apt", // Must be exactly "Apt" if the image matches perfectly, or "Needs Fix" if it requires changes or is used by a competitor.
      "right": "Point out 1-2 positive aspects that align with the brand",
      "wrong": "Point out 1-2 negative aspects, inconsistencies, or violations of brand guidelines",
      "competitorWarning": "If a competitor used this, state the warning here. Otherwise leave empty.",
      "uniqueness": "Briefly compare this to industry competitors, stating how unique this content makes the brand stand out.",
      "suggestedReplacementImageKeywords": "If status is 'Needs Fix', provide 2-3 comma separated, highly descriptive keywords to search Unsplash for a better replacement image (e.g. 'corporate, futuristic, glowing'). These keywords MUST be tailored to the specific industry of the company (e.g. cosmetics, skincare, tech) and should implicitly reflect the brand identity of '${company}'."
    }`;
    
    const reply = await callGemini(prompt, imageBase64, mimeType);
    
    try {
      let jsonString = reply.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsedReply = JSON.parse(jsonString);
      res.json({ reply: parsedReply });
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", reply);
      res.status(500).json({ error: "Failed to parse AI response into JSON format." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for Competitor Intel
router.post('/competitor-intel', async (req, res) => {
  try {
    const { company, competitor } = req.body;
    if (!company || !competitor) {
      return res.status(400).json({ error: "Both company and competitor are required" });
    }
    
    const brandContext = await getBrandContext(company);
    const prompt = `You are BrandSphere AI, an expert brand strategist. The user's brand is "${company}". The competitor is "${competitor}".
    
    ${brandContext}
    
    Generate a realistic, simulated recent market advancement or product launch by "${competitor}" (something that would happen this week).
    Then, critically analyze how this specific advancement threatens or impacts the "${company}" brand, given the brand details above.
    
    You MUST output your response strictly in the following JSON format (do not include markdown codeblocks around the JSON):
    {
      "advancementTitle": "Short catchy title of the competitor's move",
      "advancementDescription": "1-2 sentences describing what the competitor did.",
      "threatLevel": "High", // Can be "Low", "Medium", "High", or "Critical"
      "impactAnalysis": "2-3 sentences explaining exactly how this affects our brand and what we should do."
    }`;
    
    const replyText = await callGemini(prompt);
    
    // Clean up potential markdown blocks if Gemini includes them
    let jsonString = replyText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    try {
      const data = JSON.parse(jsonString);
      res.json(data);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", replyText);
      res.status(500).json({ error: "Failed to parse AI response into JSON format." });
    }
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for Opportunity Radar
router.post('/opportunity-radar', async (req, res) => {
  try {
    const { company } = req.body;
    if (!company) {
      return res.status(400).json({ error: "Company name is required" });
    }
    
    const brandContext = await getBrandContext(company);
    const prompt = `You are BrandSphere AI, an expert brand strategist. The user's brand is "${company}".
    
    ${brandContext}
    
    Analyze the current media, technology, and cultural landscape to identify massive growth opportunities tailored specifically for this brand based on their DNA above.
    
    You MUST output your response strictly in the following JSON format (do not include markdown codeblocks around the JSON):
    {
      "trends": [
        { "name": "Name of Trend (e.g., Short-form Edutainment)", "impact": 95 },
        { "name": "Name of Trend", "impact": 88 },
        { "name": "Name of Trend", "impact": 72 }
      ],
      "now": [
        { "title": "Immediate Action Title", "description": "1-2 sentences on what to do this month.", "action": "Draft campaign for this" }
      ],
      "future": [
        { "title": "Future Shift Title", "description": "1-2 sentences on what to plan for next year.", "action": "Analyze feasibility" }
      ]
    }`;
    
    const replyText = await callGemini(prompt);
    
    let jsonString = replyText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    try {
      const data = JSON.parse(jsonString);
      res.json(data);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", replyText);
      res.status(500).json({ error: "Failed to parse AI response into JSON format." });
    }
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Executive Summary Report
router.post('/generate-report', async (req, res) => {
  const { company, historyLogs } = req.body;
  
  if (!company) {
    return res.status(400).json({ error: 'Company name is required' });
  }

  try {
    const brandContext = await getBrandContext(company);
    let context = `Generate a high-level executive summary report for the brand: ${company}.\n\n${brandContext}\n`;
    
    if (historyLogs && historyLogs.length > 0) {
      context += `\nHere are some of their recent AI actions and evaluations:\n`;
      historyLogs.forEach(log => {
        context += `- ${log.type.toUpperCase()}: ${log.title} (Score: ${log.score}%, Status: ${log.status})\n`;
      });
    }

    const prompt = `${context}
    
You are a fractional CMO and Brand Strategist AI. Return a JSON object representing the executive report with the following structure exactly:
\`\`\`json
{
  "executiveSummary": "A strong, 2-3 sentence overview of the brand's current positioning, incorporating their actual mission and audience.",
  "brandHealthScore": 85,
  "topThreats": [
    {"title": "Threat 1", "description": "Description"},
    {"title": "Threat 2", "description": "Description"}
  ],
  "immediateOpportunities": [
    {"title": "Opp 1", "description": "Description"},
    {"title": "Opp 2", "description": "Description"}
  ],
  "strategicRecommendation": "A powerful closing paragraph advising on the next 30 days based on their brand USP."
}
\`\`\`
Do not include markdown blocks outside the JSON if possible, just return the JSON object directly.`;

    const replyText = await callGemini(prompt);
    let jsonString = replyText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    try {
      const data = JSON.parse(jsonString);
      res.json(data);
    } catch (parseError) {
      console.error("Failed to parse report JSON:", replyText);
      res.status(500).json({ error: "Failed to parse AI response into JSON format." });
    }
  } catch (error) {
    console.error("Generate Report API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
