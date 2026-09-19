const mongoose = require('mongoose');

const STATUSES = ['Saved', 'Applied', 'Assessment', 'Interview', 'Rejected', 'Selected'];

const jobApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: 120
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      default: '',
      maxlength: 20000
    },
    jobUrl: {
      type: String,
      default: '',
      trim: true
    },
    location: {
      type: String,
      default: '',
      trim: true,
      maxlength: 120
    },
    dateApplied: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'Saved'
    },
    notes: {
      type: String,
      default: '',
      maxlength: 5000
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      default: null
    }
  },
  { timestamps: true }
);

jobApplicationSchema.statics.STATUSES = STATUSES;

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
