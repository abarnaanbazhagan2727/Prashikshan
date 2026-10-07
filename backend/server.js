// server.js — Prashikshan Backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// ─── Connect to MongoDB ───────────────────────────────────
connectDB();

const app = express();

// ─── Rate Limiting ────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per window per IP
  message: { success: false, message: 'Too many requests. Please try again in 15 minutes.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // stricter for auth routes
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
});

// ─── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:8080',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// ─── Health Check ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '⚡ Prashikshan API is running',
    version: '1.0.0',
    endpoints: {
      register: 'POST /api/register',
      login: 'POST /api/login',
      me: 'GET /api/me',
      dashboard: 'GET /api/dashboard',
      assessments: '/api/assessments',
      projects: '/api/projects',
    },
  });
});

// ─── API Routes ───────────────────────────────────────────
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const assessmentRoutes = require('./routes/assessments');
const projectRoutes = require('./routes/projects');

app.use('/api', authLimiter, authRoutes);     // /api/register, /api/login, /api/me
app.use('/api/dashboard', dashboardRoutes);   // /api/dashboard
app.use('/api/assessments', assessmentRoutes);
app.use('/api/projects', projectRoutes);

// ─── 404 Handler ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ─── Global Error Handler ─────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Prashikshan server running on http://localhost:${PORT}`);
  console.log(`📋 API docs at       http://localhost:${PORT}/\n`);
});
