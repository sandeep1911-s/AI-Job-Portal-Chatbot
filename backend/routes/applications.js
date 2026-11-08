const express = require('express');
const { Application, Job, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// POST /api/applications/:jobId - Apply for a job
router.post('/:jobId', authenticate, authorize('user'), async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.jobId);
        if (!job) return res.status(404).json({ error: 'Job not found.' });
        if (!job.is_active) return res.status(400).json({ error: 'This job is no longer active.' });

        // Check duplicate
        const existing = await Application.findOne({
            where: { user_id: req.user.id, job_id: req.params.jobId },
        });
        if (existing) return res.status(400).json({ error: 'You have already applied for this job.' });

        const { cover_letter } = req.body;
        const application = await Application.create({
            user_id: req.user.id, job_id: parseInt(req.params.jobId), cover_letter,
        });

        res.status(201).json(application);
    } catch (err) {
        console.error('Apply error:', err);
        res.status(500).json({ error: 'Failed to submit application.' });
    }
});

// GET /api/applications/my - Get current user's applications
router.get('/my', authenticate, authorize('user'), async (req, res) => {
    try {
        const applications = await Application.findAll({
            where: { user_id: req.user.id },
            include: [{ model: Job, as: 'job', attributes: ['title', 'company', 'location', 'job_type', 'provider_id'] }],
            order: [['createdAt', 'DESC']],
        });

        const result = applications.map(a => ({
            ...a.toJSON(),
            job_title: a.job?.title,
            company: a.job?.company,
            provider_id: a.job?.provider_id,
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch applications.' });
    }
});

// GET /api/applications/job/:jobId - Get applications for a job (provider only)
router.get('/job/:jobId', authenticate, authorize('provider'), async (req, res) => {
    try {
        // Verify job belongs to this provider
        const job = await Job.findByPk(req.params.jobId);
        if (!job) return res.status(404).json({ error: 'Job not found.' });
        if (job.provider_id !== req.user.id) return res.status(403).json({ error: 'Not your job posting.' });

        const applications = await Application.findAll({
            where: { job_id: req.params.jobId },
            include: [{ model: User, as: 'applicant', attributes: ['username', 'email'] }],
            order: [['createdAt', 'DESC']],
        });

        const result = applications.map(a => ({
            ...a.toJSON(),
            applicant_name: a.applicant?.username,
            applicant_email: a.applicant?.email,
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch applications.' });
    }
});

// PUT /api/applications/:id/status - Update application status (provider only)
router.put('/:id/status', authenticate, authorize('provider'), async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id, {
            include: [{ model: Job, as: 'job' }],
        });

        if (!application) return res.status(404).json({ error: 'Application not found.' });
        if (application.job.provider_id !== req.user.id) {
            return res.status(403).json({ error: 'Not your job posting.' });
        }

        const { status } = req.body;
        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Status must be "accepted" or "rejected".' });
        }

        await application.update({ status });
        res.json(application);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update application status.' });
    }
});

module.exports = router;
