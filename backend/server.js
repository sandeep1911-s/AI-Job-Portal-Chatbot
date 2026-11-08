require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const bcrypt = require('bcryptjs');

// Import models to register them
const { User } = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const cvRoutes = require('./routes/cv');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const feedbackRoutes = require('./routes/feedback');
const complaintRoutes = require('./routes/complaints');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to AI Job Portal API', status: 'running' });
});

// Seed admin account
async function seedAdmin() {
    try {
        const admin = await User.findOne({ where: { role: 'admin' } });
        if (!admin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                username: 'admin',
                email: 'admin@jobportal.com',
                password: hashedPassword,
                role: 'admin',
                is_approved: true,
            });
            console.log('✅ Admin account created (admin@jobportal.com / admin123)');
        }
    } catch (err) {
        console.error('Seed error:', err);
    }
}

// Start server
async function start() {
    try {
        await sequelize.initDatabase();

        await seedAdmin();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
    }
}

start();
