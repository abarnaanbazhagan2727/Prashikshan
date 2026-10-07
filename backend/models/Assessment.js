// models/Assessment.js
const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      default: '10:00',
    },
    type: {
      type: String,
      enum: ['Remote Proctored', 'Industry Panel', 'Lab Exam', 'Written Test', 'Viva'],
      default: 'Remote Proctored',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdBy: {
      type: String, // name of faculty/industry who created it
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assessment', assessmentSchema);
