const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const Vibrant = require('node-vibrant');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

async function scrapeWebsite(url, isCompetitor = false) {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        
        console.log(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // 1. Take a screenshot
        const screenshotFileName = `${crypto.randomBytes(8).toString('hex')}.png`;
        const uploadsDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const screenshotPath = path.join(uploadsDir, screenshotFileName);
        await page.screenshot({ path: screenshotPath });
        
        // 2. Extract DOM and text content
        const html = await page.content();
        const $ = cheerio.load(html);
        
        // Remove scripts, styles, noscript, etc to get clean text
        $('script, style, noscript, iframe, img, svg, header, footer, nav').remove();
        
        let rawText = [];
        $('h1, h2, h3, p, span').each((i, el) => {
            const text = $(el).text().trim();
            if (text && text.length > 20) {
                rawText.push(text);
            }
        });
        
        // Take top 50 paragraphs/headings to avoid massive tokens
        const extractedText = rawText.slice(0, 50).join('\n\n');
        
        // 3. Extract computed fonts
        const fonts = await page.evaluate(() => {
            const elements = document.querySelectorAll('h1, h2, p, a, button');
            const fontFamilies = new Set();
            elements.forEach(el => {
                const style = window.getComputedStyle(el);
                if (style.fontFamily) {
                    fontFamilies.add(style.fontFamily);
                }
            });
            return Array.from(fontFamilies).slice(0, 5); // top 5 fonts
        });
        
        await browser.close();
        
        // 4. Extract dominant colors from screenshot
        const vibrant = new Vibrant(screenshotPath);
        const palette = await vibrant.getPalette();
        
        const colors = [];
        if (palette.Vibrant) colors.push({ label: 'Vibrant', hex: palette.Vibrant.hex });
        if (palette.Muted) colors.push({ label: 'Muted', hex: palette.Muted.hex });
        if (palette.DarkVibrant) colors.push({ label: 'Dark Vibrant', hex: palette.DarkVibrant.hex });
        if (palette.LightVibrant) colors.push({ label: 'Light Vibrant', hex: palette.LightVibrant.hex });
        
        return {
            url,
            screenshotFileName,
            screenshotPath,
            fonts,
            colors,
            extractedText
        };
        
    } catch (error) {
        if (browser) await browser.close();
        console.error('Scraping error:', error);
        throw error;
    }
}

module.exports = { scrapeWebsite };
