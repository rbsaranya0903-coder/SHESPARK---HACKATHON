const express = require('express');
const crypto = require('crypto');
const db = require('../db/database');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        // Mock hash (in a real app, use bcrypt)
        const password_hash = crypto.createHash('sha256').update(password).digest('hex');
        
        // Check if user exists
        const existing = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (existing) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        
        const userId = crypto.randomUUID();
        await db.run('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [userId, email, password_hash]);
        
        res.json({ success: true, user: { id: userId, email } });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Failed to register' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        const password_hash = crypto.createHash('sha256').update(password).digest('hex');
        
        const user = await db.get('SELECT * FROM users WHERE email = ? AND password_hash = ?', [email, password_hash]);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        res.json({ success: true, user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

module.exports = router;
