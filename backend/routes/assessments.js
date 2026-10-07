// routes/assessments.js
const express = require('express');
const router = express.Router();
const { getAssessments, createAssessment, deleteAssessment } = require('../controllers/assessmentController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/', getAssessments);                          // All roles
router.post('/', authorize('faculty', 'industry'), createAssessment); // Faculty + Industry only
router.delete('/:id', deleteAssessment);                  // Owner or faculty

module.exports = router;
