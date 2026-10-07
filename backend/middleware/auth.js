// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── Verify JWT Token ─────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header: "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided. Please log in.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (fetch fresh from DB)
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Token is no longer valid. Please log in again.',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token. Please log in again.' });
  }
};

// ─── Role-Based Access Control ────────────────────────────
// Usage: authorize('student'), authorize('faculty', 'industry')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This route is for [${roles.join(', ')}] only. Your role: ${req.user.role}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
