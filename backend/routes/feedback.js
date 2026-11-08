const express = require('express');
const { Feedback, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// POST /api/feedback - Submit feedback (any authenticated user)
router.post('/', authenticate, async (req, res) => {
    try {
        const { message, rating } = req.body;
        if (!message || !rating) return res.status(400).json({ error: 'Message and rating are required.' });
        if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5.' });

        const feedback = await Feedback.create({ user_id: req.user.id, message, rating });
        res.status(201).json(feedback);
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit feedback.' });
    }
});

// GET /api/feedback - Get all feedback (admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll({
            include: [{ model: User, as: 'user', attributes: ['username', 'email'] }],
            order: [['createdAt', 'DESC']],
        });

        const result = feedbacks.map(f => ({
            ...f.toJSON(),
            username: f.user?.username,
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch feedback.' });
    }
});

module.exports = router;
