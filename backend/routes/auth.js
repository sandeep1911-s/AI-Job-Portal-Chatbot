const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const { User } = require('../models');
const { generateToken, authenticate } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/id_proofs/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// POST /api/auth/register
router.post('/register', upload.single('id_proof'), async (req, res) => {
    try {
        const { username, email, password, role = 'user' } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required.' });
        }

        // Check existing
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) return res.status(400).json({ error: 'Email already registered.' });

        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) return res.status(400).json({ error: 'Username already taken.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const is_approved = role === 'user' || role === 'admin'; // providers need admin approval

        let id_proof = null;
        if (role === 'provider' && req.file) {
            id_proof = req.file.path.replace(/\\/g, '/'); // Normalize path for Windows
        }

        const user = await User.create({
            username, email, password: hashedPassword, role, is_approved, id_proof,
        });

        const token = generateToken(user);

        res.status(201).json({
            access_token: token,
            token_type: 'bearer',
            role: user.role,
            user_id: user.id,
            username: user.username,
            is_approved: user.is_approved,
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Registration failed.', details: err?.message || err });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid email or password.' });

        if (!user.is_active) return res.status(403).json({ error: 'Account is deactivated.' });

        const token = generateToken(user);

        res.json({
            access_token: token,
            token_type: 'bearer',
            role: user.role,
            user_id: user.id,
            username: user.username,
            is_approved: user.is_approved,
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed.' });
    }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ error: 'Email and new password are required.' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'No account found with this email address.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });

        res.json({ message: 'Password has been successfully updated.' });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ error: 'Password reset failed.' });
    }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email', 'role', 'is_active', 'is_approved', 'createdAt'],
        });
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user.' });
    }
});

module.exports = router;
