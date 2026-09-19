const Resume = require('../models/Resume');
const JobApplication = require('../models/JobApplication');
const asyncHandler = require('../utils/asyncHandler');
const { uploadPdfBuffer, deleteCloudinaryFile } = require('../services/cloudinaryService');

exports.createResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a PDF resume' });
  }

  const name = (req.body.name || '').trim();
  const version = (req.body.version || 'v1').trim();

  if (!name) {
    return res.status(400).json({ message: 'Resume name is required' });
  }

  const uploaded = await uploadPdfBuffer(req.file.buffer);

  const resume = await Resume.create({
    user: req.user._id,
    name,
    version,
    fileUrl: uploaded.secure_url,
    publicId: uploaded.public_id,
    fileType: 'PDF',
    fileSize: req.file.size,
    originalName: req.file.originalname
  });

  res.status(201).json({ resume });
});

exports.getResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });

  const withUsage = await Promise.all(
    resumes.map(async (resume) => {
      const usedCount = await JobApplication.countDocuments({
        user: req.user._id,
        resume: resume._id
      });
      return { ...resume.toObject(), usedCount };
    })
  );

  res.json({ resumes: withUsage });
});

exports.getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    return res.status(404).json({ message: 'Resume not found' });
  }
  res.json({ resume });
});

exports.deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    return res.status(404).json({ message: 'Resume not found' });
  }

  await deleteCloudinaryFile(resume.publicId);
  await JobApplication.updateMany(
    { user: req.user._id, resume: resume._id },
    { $set: { resume: null } }
  );
  await resume.deleteOne();

  res.json({ message: 'Resume deleted' });
});

exports.downloadResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    return res.status(404).json({ message: 'Resume not found' });
  }

  const response = await fetch(resume.fileUrl);
  if (!response.ok) {
    return res.status(502).json({ message: 'Could not fetch the resume file' });
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const filename = `${resume.name.replace(/[^\w\s-]/g, '')}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(buffer);
});
