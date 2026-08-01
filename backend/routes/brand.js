const express = require('express');
const crypto = require('crypto');
const { scrapeWebsite } = require('../services/scraper');
const { extractBrandDNA } = require('../services/llm');
const db = require('../db/database');

const router = express.Router();

router.post('/analyze', async (req, res) => {
    try {
        const { url, type = 'company', projectId } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }
        
        // 1. Ensure project exists if project_id is provided, otherwise create a new project ID
        let pid = projectId;
        if (!pid && type === 'company') {
            pid = crypto.randomUUID();
            await db.run('INSERT INTO projects (id, company_url) VALUES (?, ?)', [pid, url]);
        }
        
        if (!pid) {
            return res.status(400).json({ error: 'Project ID is required for competitor analysis' });
        }

        // 2. Scrape Website
        const scrapeResult = await scrapeWebsite(url, type === 'competitor');
        
        // 3. Extract Brand DNA using LLM
        const dnaResult = await extractBrandDNA(scrapeResult.extractedText);
        
        const brandDna = {
            id: crypto.randomUUID(),
            project_id: pid,
            type: type,
            url: url,
            brand_name: url.replace(/^https?:\/\//, '').split('/')[0], // simplistic extraction
            colors: JSON.stringify(scrapeResult.colors),
            fonts: JSON.stringify(scrapeResult.fonts),
            tone_descriptors: JSON.stringify(dnaResult.tone_descriptors),
            vocabulary_style: dnaResult.vocabulary_style,
            messaging_pillars: JSON.stringify(dnaResult.messaging_pillars),
            visual_style: dnaResult.visual_style,
            raw_scraped_text: scrapeResult.extractedText,
            screenshot_path: scrapeResult.screenshotFileName
        };
        
        // 4. Save to DB
        await db.run(`INSERT INTO brand_dna (
            id, project_id, type, url, brand_name, colors, fonts, tone_descriptors, 
            vocabulary_style, messaging_pillars, visual_style, raw_scraped_text, screenshot_path
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            brandDna.id, brandDna.project_id, brandDna.type, brandDna.url, brandDna.brand_name,
            brandDna.colors, brandDna.fonts, brandDna.tone_descriptors, brandDna.vocabulary_style,
            brandDna.messaging_pillars, brandDna.visual_style, brandDna.raw_scraped_text, brandDna.screenshot_path
        ]);
        
        res.json({
            success: true,
            project_id: pid,
            brand_dna: {
                ...brandDna,
                colors: scrapeResult.colors,
                fonts: scrapeResult.fonts,
                tone_descriptors: dnaResult.tone_descriptors,
                messaging_pillars: dnaResult.messaging_pillars
            }
        });
        
    } catch (error) {
        console.error('Error in /analyze route:', error);
        res.status(500).json({ error: 'Failed to analyze website. ' + error.message });
    }
});

router.get('/project/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        
        const companyDna = await db.get('SELECT * FROM brand_dna WHERE project_id = ? AND type = "company" ORDER BY created_at DESC LIMIT 1', [projectId]);
        const competitorDna = await db.all('SELECT * FROM brand_dna WHERE project_id = ? AND type = "competitor" ORDER BY created_at DESC', [projectId]);
        
        const parseJsonFields = (row) => {
            if (!row) return null;
            return {
                ...row,
                colors: JSON.parse(row.colors || '[]'),
                fonts: JSON.parse(row.fonts || '[]'),
                tone_descriptors: JSON.parse(row.tone_descriptors || '[]'),
                messaging_pillars: JSON.parse(row.messaging_pillars || '[]')
            };
        };

        res.json({
            success: true,
            company: parseJsonFields(companyDna),
            competitors: competitorDna.map(parseJsonFields)
        });
        
    } catch (error) {
        console.error('Error fetching project data:', error);
        res.status(500).json({ error: 'Failed to fetch project data' });
    }
});

module.exports = router;
