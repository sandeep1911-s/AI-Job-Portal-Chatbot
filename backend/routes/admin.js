const express = require('express');
const { User, Job, Application, Complaint, Feedback } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin role
router.use(authenticate, authorize('admin'));

// GET /api/admin/stats - Dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const [totalUsers, totalProviders, totalJobs, activeJobs, totalApplications, pendingProviders, openComplaints] = await Promise.all([
            User.count({ where: { role: 'user' } }),
            User.count({ where: { role: 'provider' } }),
            Job.count(),
            Job.count({ where: { is_active: true } }),
            Application.count(),
            User.count({ where: { role: 'provider', is_approved: false } }),
            Complaint.count({ where: { status: 'open' } }),
        ]);

        res.json({ totalUsers, totalProviders, totalJobs, activeJobs, totalApplications, pendingProviders, openComplaints });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch stats.' });
    }
});

// GET /api/admin/providers - Get all providers
router.get('/providers', async (req, res) => {
    try {
        const providers = await User.findAll({
            where: { role: 'provider' },
            attributes: ['id', 'username', 'email', 'is_approved', 'is_active', 'createdAt', 'id_proof'],
            order: [['createdAt', 'DESC']],
        });
        res.json(providers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch providers.' });
    }
});

// PUT /api/admin/providers/:id/approve - Approve or reject a provider
router.put('/providers/:id/approve', async (req, res) => {
    try {
        const provider = await User.findOne({ where: { id: req.params.id, role: 'provider' } });
        if (!provider) return res.status(404).json({ error: 'Provider not found.' });

        const { approve } = req.body;
        await provider.update({ is_approved: approve });

        res.json({ message: approve ? 'Provider approved.' : 'Provider rejected.', provider });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update provider.' });
    }
});

// GET /api/admin/active-users - Get all active users
router.get('/active-users', async (req, res) => {
    try {
        const users = await User.findAll({
            where: { is_active: true },
            attributes: ['id', 'username', 'email', 'role', 'is_approved', 'createdAt'],
            order: [['createdAt', 'DESC']],
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch active users.' });
    }
});

module.exports = router;
