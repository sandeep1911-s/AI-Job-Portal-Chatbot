const express = require('express');
const { CV } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { generateCVSummary } = require('../services/aiService');

const router = express.Router();

// POST /api/cv - Create or update CV
router.post('/', authenticate, authorize('user'), async (req, res) => {
    try {
        const { full_name, email, phone, education, skills, experience, career_goals } = req.body;

        // Generate AI summary
        const ai_summary = await generateCVSummary({ full_name, education, skills, experience, career_goals });

        const existing = await CV.findOne({ where: { user_id: req.user.id } });

        if (existing) {
            await existing.update({ full_name, email, phone, education, skills, experience, career_goals, ai_summary });
            return res.json(existing);
        }

        const cv = await CV.create({
            user_id: req.user.id, full_name, email, phone, education, skills, experience, career_goals, ai_summary,
        });

        res.status(201).json(cv);
    } catch (err) {
        console.error('CV create error:', err);
        res.status(500).json({ error: 'Failed to save CV.' });
    }
});

// GET /api/cv - Get current user's CV
router.get('/', authenticate, async (req, res) => {
    try {
        const cv = await CV.findOne({ where: { user_id: req.user.id } });
        if (!cv) return res.status(404).json({ error: 'CV not found. Create one first.' });
        res.json(cv);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch CV.' });
    }
});

// GET /api/cv/:userId - Get a specific user's CV (for providers viewing applicant CVs)
router.get('/:userId', authenticate, authorize('provider', 'admin'), async (req, res) => {
    try {
        const cv = await CV.findOne({ where: { user_id: req.params.userId } });
        if (!cv) return res.status(404).json({ error: 'CV not found.' });
        res.json(cv);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch CV.' });
    }
});

// POST /api/cv/regenerate-summary - Regenerate AI summary
router.post('/regenerate-summary', authenticate, authorize('user'), async (req, res) => {
    try {
        const cv = await CV.findOne({ where: { user_id: req.user.id } });
        if (!cv) return res.status(404).json({ error: 'CV not found. Create one first.' });

        const ai_summary = await generateCVSummary(cv.toJSON());
        await cv.update({ ai_summary });

        res.json({ ai_summary });
    } catch (err) {
        res.status(500).json({ error: 'Failed to regenerate summary.' });
    }
});

module.exports = router;
