const axios = require('axios');
const fs = require('fs');

async function extractBrandDNA(text) {
    console.log('Extracting Brand DNA via LLM...');
    
    // Support OpenAI or Gemini if configured
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    const prompt = `
    Analyze the following scraped text from a company's website and extract its Brand DNA.
    Return ONLY a valid JSON object with the following structure:
    {
      "tone_descriptors": ["word1", "word2", "word3", "word4", "word5"],
      "vocabulary_style": "A brief sentence describing the vocabulary used (e.g., 'Formal and technical' or 'Casual and playful')",
      "messaging_pillars": ["Pillar 1", "Pillar 2", "Pillar 3"],
      "visual_style": "A brief sentence describing visual style cues based on text"
    }
    
    Text:
    ${text}
    `;

    try {
        if (geminiKey) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
            const response = await axios.post(url, {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    response_mime_type: "application/json"
                }
            });
            const textResponse = response.data.candidates[0].content.parts[0].text;
            return JSON.parse(textResponse);
        } else if (openaiKey) {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: "json_object" }
            }, {
                headers: { 'Authorization': `Bearer ${openaiKey}` }
            });
            const textResponse = response.data.choices[0].message.content;
            return JSON.parse(textResponse);
        } else {
            // Fallback mock if no API key is set so the app doesn't break
            console.log("No LLM API keys found, returning mock DNA.");
            return {
                tone_descriptors: ["Professional", "Innovative", "Reliable"],
                vocabulary_style: "Clear and authoritative.",
                messaging_pillars: ["Quality", "Innovation", "Customer Success"],
                visual_style: "Clean and corporate."
            };
        }
    } catch (error) {
        console.error('LLM Extraction error:', error?.response?.data || error.message);
        throw new Error('Failed to extract Brand DNA');
    }
}

async function analyzeImageFit(imagePath, companyDna) {
    console.log('Analyzing Image Fit via LLM...');
    
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    
    const base64Image = fs.readFileSync(imagePath).toString('base64');
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';
    
    const prompt = `
    Analyze this image and compare its mood, style, and lighting with the provided company Brand DNA.
    
    Company Brand DNA:
    Tone: ${companyDna.tone_descriptors}
    Vocabulary Style: ${companyDna.vocabulary_style}
    Visual Style: ${companyDna.visual_style}
    Colors (Hex): ${companyDna.colors}
    
    Return ONLY a valid JSON object with the following structure:
    {
      "mood_description": "Description of the image's mood/style",
      "fit_score": 85, // integer 0-100
      "reasoning": ["Match: Both use professional tones.", "Mismatch: Image is dark but brand is light."]
    }
    `;
    
    try {
        if (geminiKey) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
            const response = await axios.post(url, {
                contents: [{
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: mimeType, data: base64Image } }
                    ]
                }],
                generationConfig: {
                    response_mime_type: "application/json"
                }
            });
            return JSON.parse(response.data.candidates[0].content.parts[0].text);
        } else if (openaiKey) {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4o',
                messages: [{
                    role: 'user',
                    content: [
                        { type: "text", text: prompt },
                        { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}` } }
                    ]
                }],
                response_format: { type: "json_object" }
            }, {
                headers: { 'Authorization': `Bearer ${openaiKey}` }
            });
            return JSON.parse(response.data.choices[0].message.content);
        } else {
            console.log("No LLM API keys found, returning mock image evaluation.");
            return {
                mood_description: "Bright and playful.",
                fit_score: 50,
                reasoning: ["Mismatch: Image is playful but brand is corporate."]
            };
        }
    } catch (error) {
        console.error('LLM Vision error:', error?.response?.data || error.message);
        throw new Error('Failed to analyze image fit');
    }
}

module.exports = { extractBrandDNA, analyzeImageFit };
