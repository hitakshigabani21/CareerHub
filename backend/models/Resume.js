const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Resume name is required'],
      trim: true,
      maxlength: 120
    },
    version: {
      type: String,
      trim: true,
      default: 'v1',
      maxlength: 40
    },
    fileUrl: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      default: 'PDF'
    },
    fileSize: {
      type: Number,
      default: 0
    },
    originalName: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
