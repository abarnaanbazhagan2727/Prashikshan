// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['IN PROGRESS', 'QUEUED', 'PRIORITY', 'COMPLETED', 'ON HOLD'],
      default: 'QUEUED',
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
