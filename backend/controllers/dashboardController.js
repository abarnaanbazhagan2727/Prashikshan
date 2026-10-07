// controllers/dashboardController.js
const Assessment = require('../models/Assessment');
const Project = require('../models/Project');

// ─── GET /api/dashboard ───────────────────────────────────
// @desc   Get role-specific dashboard data
// @access Private (all roles — returns data based on role)
exports.getDashboard = async (req, res, next) => {
  try {
    const user = req.user;

    // ── STUDENT DASHBOARD ──────────────────────────────────
    if (user.role === 'student') {
      const assessments = await Assessment.find({ userId: user._id }).sort({ date: 1 }).limit(10);
      return res.status(200).json({
        success: true,
        role: 'student',
        data: {
          welcomeMessage: `Welcome back, ${user.name.split(' ')[0]}! Keep pushing forward.`,
          stats: {
            pendingAssessments: assessments.filter(a => new Date(a.date) >= new Date()).length,
            completedAssessments: assessments.filter(a => new Date(a.date) < new Date()).length,
            skillScore: 82,
            projectMatches: 4,
          },
          upcomingAssessments: assessments,
          skills: [
            { name: 'System Architecture', score: 88, level: 'Expert', verified: true },
            { name: 'Data Engineering', score: 72, level: 'Advanced', verified: false },
            { name: 'Cloud Infrastructure', score: 38, level: 'Critical Gap', verified: false },
            { name: 'Statistical Mathematics', score: 92, level: 'Expert', verified: true },
            { name: 'Neural Architectures', score: 85, level: 'Advanced', verified: true },
          ],
        },
      });
    }

    // ── FACULTY DASHBOARD ──────────────────────────────────
    if (user.role === 'faculty') {
      const allAssessments = await Assessment.find().sort({ createdAt: -1 }).limit(20);
      return res.status(200).json({
        success: true,
        role: 'faculty',
        data: {
          welcomeMessage: `Faculty Portal – Hello, ${user.name}`,
          stats: {
            totalStudents: 124,
            activeAssessments: allAssessments.filter(a => new Date(a.date) >= new Date()).length,
            industryConnections: 18,
            pendingReviews: 7,
          },
          recentAssessments: allAssessments.slice(0, 5),
          facultyInsights: {
            topSkillGap: 'Cloud Infrastructure',
            avgSkillScore: 74,
            studentsAtRisk: 12,
          },
        },
      });
    }

    // ── INDUSTRY PARTNER DASHBOARD ─────────────────────────
    if (user.role === 'industry') {
      const projects = await Project.find({ userId: user._id }).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        role: 'industry',
        data: {
          welcomeMessage: `Industry Portal – Welcome, ${user.name}`,
          stats: {
            activeProjects: projects.filter(p => p.status === 'IN PROGRESS').length,
            totalProjects: projects.length,
            studentApplications: 23,
            shortlistedCandidates: 8,
          },
          projects,
          topCandidateSkills: ['System Architecture', 'ML/AI', 'Data Engineering'],
        },
      });
    }

    res.status(400).json({ success: false, message: 'Unknown role.' });
  } catch (err) {
    next(err);
  }
};
