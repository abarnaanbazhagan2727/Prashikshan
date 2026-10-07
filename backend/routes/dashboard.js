// routes/dashboard.js
const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// GET /api/dashboard — returns role-specific data
// Accessible by all authenticated users (role filtering happens in controller)
router.get('/', protect, getDashboard);

module.exports = router;
