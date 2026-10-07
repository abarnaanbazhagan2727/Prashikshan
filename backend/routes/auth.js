// routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login, getMe, updateMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (must be logged in)
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

module.exports = router;
