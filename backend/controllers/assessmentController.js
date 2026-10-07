// controllers/assessmentController.js
const Assessment = require('../models/Assessment');

// GET /api/assessments — get user's assessments (students) or all (faculty)
exports.getAssessments = async (req, res, next) => {
  try {
    let query;
    if (req.user.role === 'faculty') {
      query = Assessment.find().sort({ date: 1 }); // Faculty sees all
    } else {
      query = Assessment.find({ userId: req.user._id }).sort({ date: 1 });
    }
    const assessments = await query;
    res.status(200).json({ success: true, count: assessments.length, assessments });
  } catch (err) { next(err); }
};

// POST /api/assessments — create assessment (faculty or industry only)
exports.createAssessment = async (req, res, next) => {
  try {
    const { title, date, time, type } = req.body;
    if (!title || !date) {
      return res.status(400).json({ success: false, message: 'Title and date are required.' });
    }
    const assessment = await Assessment.create({
      title, date, time, type,
      userId: req.user._id,
      createdBy: req.user.name,
    });
    res.status(201).json({ success: true, assessment });
  } catch (err) { next(err); }
};

// DELETE /api/assessments/:id — delete (owner only)
exports.deleteAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found.' });
    if (assessment.userId.toString() !== req.user._id.toString() && req.user.role !== 'faculty') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this assessment.' });
    }
    await assessment.deleteOne();
    res.status(200).json({ success: true, message: 'Assessment deleted.' });
  } catch (err) { next(err); }
};
