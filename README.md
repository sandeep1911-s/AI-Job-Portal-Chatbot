# AI Chatbot – AI Job Portal

A full-stack AI-powered Job Portal chatbot built with React (Vite) and Node.js (Express + Sequelize).

## Features

- 🤖 AI Chat assistant (Groq API)
- 👤 User / Provider / Admin roles
- 📋 Job posting & applications
- 📄 CV Builder with AI summary
- 🔐 JWT authentication
- 📊 Admin dashboard (approve providers, manage complaints)
- 💬 Feedback & complaint system

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express 5, Sequelize 6 |
| Database | PostgreSQL (Supabase) with SQLite fallback |
| AI | Groq SDK |
| Auth | JWT (jsonwebtoken) |

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm

### Backend

```bash
cd backend
npm install
# Create a .env file (see .env.example)
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create `backend/.env`:

```
PORT=8000
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=postgresql://...   # optional, falls back to SQLite
```

## Default Admin Credentials

- Email: `admin@jobportal.com`
- Password: `admin123`

## Project Structure

```
AI Chatbot/
├── backend/
│   ├── config/        # Database configuration
│   ├── middleware/    # JWT auth middleware
│   ├── models/        # Sequelize models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── uploads/       # File uploads
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── api.js
    └── index.html
```
