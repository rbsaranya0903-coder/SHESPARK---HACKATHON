require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db/database');

const brandRoutes = require('./routes/brand');
const authRoutes = require('./routes/auth');
const onboardingRoutes = require('./routes/onboarding');
const aiRoutes = require('./routes/ai');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize DB
db.initDb();

// Routes
app.use('/api/brand', brandRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/ai', aiRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'BrandPulse API is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
