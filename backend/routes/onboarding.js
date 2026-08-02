const express = require('express');
const crypto = require('crypto');
const db = require('../db/database');

const router = express.Router();

// Get onboarding status
router.get('/:userId', async (req, res) => {
    try {
        const profile = await db.get('SELECT * FROM organization_profile WHERE user_id = ?', [req.params.userId]);
        res.json({ success: true, profile: profile || null });
    } catch (error) {
        console.error('Fetch onboarding error:', error);
        res.status(500).json({ error: 'Failed to fetch onboarding profile' });
    }
});

// Update onboarding step
router.post('/:userId/step', async (req, res) => {
    try {
        const { userId } = req.params;
        const { step, data } = req.body;
        
        let profile = await db.get('SELECT * FROM organization_profile WHERE user_id = ?', [userId]);
        
        if (!profile) {
            const profileId = crypto.randomUUID();
            await db.run('INSERT INTO organization_profile (id, user_id, onboarding_step) VALUES (?, ?, ?)', [profileId, userId, step]);
            profile = { id: profileId, user_id: userId, onboarding_step: step };
        }
        
        // Update fields based on step
        let sql = 'UPDATE organization_profile SET onboarding_step = ?';
        const params = [step];
        
        if (data.company_name !== undefined) { sql += ', company_name = ?'; params.push(data.company_name); }
        if (data.industry !== undefined) { sql += ', industry = ?'; params.push(data.industry); }
        if (data.target_audience !== undefined) { sql += ', target_audience = ?'; params.push(data.target_audience); }
        if (data.social_links !== undefined) { sql += ', social_links = ?'; params.push(JSON.stringify(data.social_links)); }
        if (data.competitors !== undefined) { sql += ', competitors = ?'; params.push(JSON.stringify(data.competitors)); }
        
        if (data.brand_details !== undefined) {
            sql += ', brand_details = ?';
            params.push(typeof data.brand_details === 'string' ? data.brand_details : JSON.stringify(data.brand_details));
        } else {
            const { company_name, industry, target_audience, social_links, competitors, ...rest } = data;
            if (Object.keys(rest).length > 0) {
                sql += ', brand_details = ?';
                params.push(JSON.stringify(rest));
            }
        }
        
        sql += ' WHERE user_id = ?';
        params.push(userId);
        
        await db.run(sql, params);
        
        res.json({ success: true, step });
    } catch (error) {
        console.error('Update onboarding step error:', error);
        res.status(500).json({ error: 'Failed to update onboarding progress' });
    }
});

module.exports = router;
