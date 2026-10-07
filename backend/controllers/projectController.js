// controllers/projectController.js
const Project = require('../models/Project');

// GET /api/projects — students see all, industry sees their own
exports.getProjects = async (req, res, next) => {
  try {
    let projects;
    if (req.user.role === 'student' || req.user.role === 'faculty') {
      projects = await Project.find().sort({ createdAt: -1 }); // see all projects
    } else {
      projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
    }
    res.status(200).json({ success: true, count: projects.length, projects });
  } catch (err) { next(err); }
};

// POST /api/projects — only industry partners create projects
exports.createProject = async (req, res, next) => {
  try {
    if (req.user.role === 'student') {
      return res.status(403).json({ success: false, message: 'Students cannot create projects. Only Industry Partners can.' });
    }
    const { title, category, description, status, progress } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Project title is required.' });
    const project = await Project.create({
      title, category, description, status, progress: progress || 0,
      userId: req.user._id,
    });
    res.status(201).json({ success: true, project });
  } catch (err) { next(err); }
};

// PUT /api/projects/:id — update project (owner only)
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this project.' });
    }
    project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, project });
  } catch (err) { next(err); }
};

// DELETE /api/projects/:id
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    if (project.userId.toString() !== req.user._id.toString() && req.user.role !== 'faculty') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    await project.deleteOne();
    res.status(200).json({ success: true, message: 'Project deleted.' });
  } catch (err) { next(err); }
};
