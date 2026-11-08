const express = require('express');
const { CV, Job } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { getJobSuggestions, getSkillSuggestions, getChatResponse } = require('../services/aiService');

const router = express.Router();

// GET /api/ai/job-suggestions - AI job suggestions based on CV skills
router.get('/job-suggestions', authenticate, authorize('user'), async (req, res) => {
    try {
        const cv = await CV.findOne({ where: { user_id: req.user.id } });
        if (!cv) return res.status(400).json({ error: 'Please create your CV first to get job suggestions.' });

        const jobs = await Job.findAll({ where: { is_active: true } });
        const jobData = jobs.map(j => j.toJSON());

        const suggestions = await getJobSuggestions(cv.skills, cv.experience, jobData);
        res.json(suggestions);
    } catch (err) {
        console.error('Job suggestions error:', err);
        res.status(500).json({ error: 'Failed to get job suggestions.' });
    }
});

// GET /api/ai/skill-suggestions - AI skill suggestions for career growth
router.get('/skill-suggestions', authenticate, authorize('user'), async (req, res) => {
    try {
        const cv = await CV.findOne({ where: { user_id: req.user.id } });
        if (!cv) return res.status(400).json({ error: 'Please create your CV first to get skill suggestions.' });

        const suggestions = await getSkillSuggestions(cv.skills, cv.career_goals);
        res.json(suggestions);
    } catch (err) {
        console.error('Skill suggestions error:', err);
        res.status(500).json({ error: 'Failed to get skill suggestions.' });
    }
});

// POST /api/ai/chat - AI career counselor chat
router.post('/chat', authenticate, async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required.' });

        const response = await getChatResponse(message, history || []);
        res.json({ response });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get AI response.' });
    }
});

module.exports = router;
