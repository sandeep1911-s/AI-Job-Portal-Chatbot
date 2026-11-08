const express = require('express');
const { Complaint, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// POST /api/complaints - Submit a complaint
router.post('/', authenticate, async (req, res) => {
    try {
        const { subject, message, provider_id } = req.body;
        if (!subject || !message) return res.status(400).json({ error: 'Subject and message are required.' });

        const complaint = await Complaint.create({ user_id: req.user.id, subject, message, provider_id: provider_id || null });
        res.status(201).json(complaint);
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit complaint.' });
    }
});

// GET /api/complaints - Get all complaints (admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
    try {
        const complaints = await Complaint.findAll({
            include: [
                { model: User, as: 'user', attributes: ['username', 'email'] },
                { model: User, as: 'provider', attributes: ['username', 'email'] }
            ],
            order: [['createdAt', 'DESC']],
        });

        const result = complaints.map(c => ({
            ...c.toJSON(),
            username: c.user?.username,
            provider_name: c.provider?.username,
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch complaints.' });
    }
});

// GET /api/complaints/my - Get current user's complaints
router.get('/my', authenticate, async (req, res) => {
    try {
        const complaints = await Complaint.findAll({
            where: { user_id: req.user.id },
            include: [{ model: User, as: 'provider', attributes: ['username'] }],
            order: [['createdAt', 'DESC']],
        });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch complaints.' });
    }
});

// PUT /api/complaints/:id/reply - Reply to a complaint (admin only)
router.put('/:id/reply', authenticate, authorize('admin'), async (req, res) => {
    try {
        const complaint = await Complaint.findByPk(req.params.id);
        if (!complaint) return res.status(404).json({ error: 'Complaint not found.' });

        const { admin_reply } = req.body;
        if (!admin_reply) return res.status(400).json({ error: 'Reply is required.' });

        await complaint.update({ admin_reply, status: 'replied' });
        res.json(complaint);
    } catch (err) {
        res.status(500).json({ error: 'Failed to reply to complaint.' });
    }
});

// PUT /api/complaints/:id/message-provider - Admin sends a message to the provider about a complaint
router.put('/:id/message-provider', authenticate, authorize('admin'), async (req, res) => {
    try {
        const complaint = await Complaint.findByPk(req.params.id);
        if (!complaint) return res.status(404).json({ error: 'Complaint not found.' });
        if (!complaint.provider_id) return res.status(400).json({ error: 'No provider associated with this complaint.' });

        const { admin_message_to_provider } = req.body;
        if (!admin_message_to_provider) return res.status(400).json({ error: 'Message is required.' });

        await complaint.update({ admin_message_to_provider });
        res.json(complaint);
    } catch (err) {
        console.error('Error sending message to provider:', err);
        res.status(500).json({ error: 'Failed to send message to provider.' });
    }
});

// GET /api/complaints/provider - Get all complaints directed to current user (provider)
router.get('/provider', authenticate, authorize('provider'), async (req, res) => {
    try {
        const complaints = await Complaint.findAll({
            where: { provider_id: req.user.id },
            include: [{ model: User, as: 'user', attributes: ['username', 'email'] }],
            order: [['createdAt', 'DESC']],
        });

        const result = complaints.map(c => ({
            ...c.toJSON(),
            username: c.user?.username,
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch complaints for provider.' });
    }
});

// PUT /api/complaints/:id/provider-reply - Reply to a complaint (provider only)
router.put('/:id/provider-reply', authenticate, authorize('provider'), async (req, res) => {
    try {
        const complaint = await Complaint.findByPk(req.params.id);
        if (!complaint) return res.status(404).json({ error: 'Complaint not found.' });
        if (complaint.provider_id !== req.user.id) return res.status(403).json({ error: 'Not authorized for this complaint.' });

        const { provider_reply } = req.body;
        if (!provider_reply) return res.status(400).json({ error: 'Reply is required.' });

        await complaint.update({ provider_reply, status: 'replied' });
        res.json(complaint);
    } catch (err) {
        res.status(500).json({ error: 'Failed to reply to complaint.' });
    }
});

module.exports = router;
