const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'user' }, // user, provider, admin
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_approved: { type: DataTypes.BOOLEAN, defaultValue: true },
    id_proof: { type: DataTypes.STRING, allowNull: true },
}, { tableName: 'users', timestamps: true });

const CV = sequelize.define('CV', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, unique: true, allowNull: false },
    full_name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    education: { type: DataTypes.JSON, defaultValue: [] },
    skills: { type: DataTypes.JSON, defaultValue: [] },
    experience: { type: DataTypes.JSON, defaultValue: [] },
    career_goals: { type: DataTypes.TEXT },
    ai_summary: { type: DataTypes.TEXT },
}, { tableName: 'cvs', timestamps: true });

const Job = sequelize.define('Job', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    provider_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    company: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    skills_required: { type: DataTypes.JSON, defaultValue: [] },
    salary_min: { type: DataTypes.FLOAT },
    salary_max: { type: DataTypes.FLOAT },
    location: { type: DataTypes.STRING },
    job_type: { type: DataTypes.STRING, defaultValue: 'full-time' },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'jobs', timestamps: true });

const Application = sequelize.define('Application', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    job_id: { type: DataTypes.INTEGER, allowNull: false },
    cover_letter: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending, accepted, rejected
}, { tableName: 'applications', timestamps: true });

const Feedback = sequelize.define('Feedback', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'feedbacks', timestamps: true });

const Complaint = sequelize.define('Complaint', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    provider_id: { type: DataTypes.INTEGER, allowNull: true },
    subject: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    admin_reply: { type: DataTypes.TEXT },
    provider_reply: { type: DataTypes.TEXT },
    admin_message_to_provider: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING, defaultValue: 'open' }, // open, replied, resolved
}, { tableName: 'complaints', timestamps: true });

// ─── Associations ──────────────────────────────────────────────
User.hasOne(CV, { foreignKey: 'user_id', as: 'cv' });
CV.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });

User.hasMany(Job, { foreignKey: 'provider_id', as: 'jobs' });
Job.belongsTo(User, { foreignKey: 'provider_id', as: 'provider' });

User.hasMany(Application, { foreignKey: 'user_id', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'user_id', as: 'applicant' });

Job.hasMany(Application, { foreignKey: 'job_id', as: 'applications' });
Application.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

User.hasMany(Feedback, { foreignKey: 'user_id', as: 'feedbacks' });
Feedback.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Complaint, { foreignKey: 'user_id', as: 'complaints' });
Complaint.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Complaint, { foreignKey: 'provider_id', as: 'provider_complaints' });
Complaint.belongsTo(User, { foreignKey: 'provider_id', as: 'provider' });

module.exports = { User, CV, Job, Application, Feedback, Complaint };
