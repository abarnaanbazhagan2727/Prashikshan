// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── Helper: Generate JWT ─────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ─── Helper: Send token response ─────────────────────────
const sendTokenResponse = (res, statusCode, user) => {
  const token = generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  });
};

// ─── POST /api/register ──────────────────────────────────
// @desc   Register new user
// @access Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    // Validate role
    const allowedRoles = ['student', 'faculty', 'industry'];
    const userRole = role && allowedRoles.includes(role) ? role : 'student';

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Create user (password is hashed by model pre-save hook)
    const user = await User.create({ name, email, password, role: userRole });

    sendTokenResponse(res, 201, user);
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/login ──────────────────────────────────────
// @desc   Login user
// @access Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email and password.',
      });
    }

    // Find user (include password field for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found with this email.',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Try again.',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Contact support.',
      });
    }

    sendTokenResponse(res, 200, user);
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/me ──────────────────────────────────────────
// @desc   Get current logged-in user profile
// @access Private (any authenticated user)
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/me ──────────────────────────────────────────
// @desc   Update current user profile (bio, name)
// @access Private
exports.updateMe = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
};
