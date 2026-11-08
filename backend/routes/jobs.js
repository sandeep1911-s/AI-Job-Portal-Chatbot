const express = require('express');
const { Job, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// POST /api/jobs - Create a job (provider only)
router.post('/', authenticate, authorize('provider'), async (req, res) => {
    try {
        // Check if provider is approved
        const provider = await User.findByPk(req.user.id);
        if (!provider.is_approved) {
            return res.status(403).json({ error: 'Your account is pending admin approval. You cannot post jobs yet.' });
        }

        const { title, company, description, skills_required, salary_min, salary_max, location, job_type } = req.body;

        const job = await Job.create({
            provider_id: req.user.id, title, company, description,
            skills_required: skills_required || [], salary_min, salary_max, location, job_type,
        });

        res.status(201).json(job);
    } catch (err) {
        console.error('Job create error:', err);
        res.status(500).json({ error: 'Failed to create job.' });
    }
});

// GET /api/jobs - Get all active jobs (public, but with is_applied if authenticated)
router.get('/', async (req, res) => {
    try {
        const { Application } = require('../models');
        const jwt = require('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET || 'ai_job_portal_secret_key_2026';

        // Check for token to identify if user has applied
        let appliedJobIds = [];
        const authHeader = req.headers.authorization;
        console.log('Auth Header:', authHeader ? 'Present' : 'Missing');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, JWT_SECRET);
                console.log('Decoded User ID:', decoded.id);
                const applications = await Application.findAll({
                    where: { user_id: decoded.id },
                    attributes: ['job_id']
                });
                appliedJobIds = applications.map(a => a.job_id);
                console.log('Applied Job IDs:', appliedJobIds);
            } catch (authErr) {
                console.error('Auth Error in jobs route:', authErr.message);
                // Ignore auth error for public route
            }
        }

        const jobs = await Job.findAll({
            where: { is_active: true },
            include: [{ model: User, as: 'provider', attributes: ['username', 'email'] }],
            order: [['createdAt', 'DESC']],
        });

        const result = jobs.map(j => {
            const jobData = j.toJSON();
            const isApplied = appliedJobIds.some(id => Number(id) === Number(j.id));
            return {
                ...jobData,
                provider_name: j.provider?.username,
                is_applied: isApplied
            };
        });

        res.json(result);
    } catch (err) {
        console.error('Jobs fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch jobs.' });
    }
});

// GET /api/jobs/my - Get provider's own jobs
router.get('/my', authenticate, authorize('provider'), async (req, res) => {
    try {
        const jobs = await Job.findAll({
            where: { provider_id: req.user.id },
            order: [['createdAt', 'DESC']],
        });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch your jobs.' });
    }
});

// GET /api/jobs/:id - Get single job
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id, {
            include: [{ model: User, as: 'provider', attributes: ['username', 'email'] }],
        });
        if (!job) return res.status(404).json({ error: 'Job not found.' });

        const result = { ...job.toJSON(), provider_name: job.provider?.username };
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch job.' });
    }
});

// PUT /api/jobs/:id - Update job (provider only, own jobs)
router.put('/:id', authenticate, authorize('provider'), async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found.' });
        if (job.provider_id !== req.user.id) return res.status(403).json({ error: 'Not your job posting.' });

        await job.update(req.body);
        res.json(job);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update job.' });
    }
});

// DELETE /api/jobs/:id - Delete job (provider only, own jobs)
router.delete('/:id', authenticate, authorize('provider'), async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found.' });
        if (job.provider_id !== req.user.id) return res.status(403).json({ error: 'Not your job posting.' });

        await job.destroy();
        res.json({ message: 'Job deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete job.' });
    }
});

module.exports = router;
