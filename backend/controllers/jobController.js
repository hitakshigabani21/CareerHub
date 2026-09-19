const JobApplication = require('../models/JobApplication');
const Resume = require('../models/Resume');
const asyncHandler = require('../utils/asyncHandler');

const STATUSES = JobApplication.STATUSES;

async function assertOwnResume(userId, resumeId) {
  if (!resumeId) return null;
  const resume = await Resume.findOne({ _id: resumeId, user: userId });
  if (!resume) {
    const err = new Error('Selected resume was not found');
    err.statusCode = 400;
    throw err;
  }
  return resume;
}

function pickFields(body) {
  const allowed = [
    'company',
    'title',
    'description',
    'jobUrl',
    'location',
    'dateApplied',
    'status',
    'notes',
    'resume'
  ];
  const data = {};
  allowed.forEach((key) => {
    if (body[key] !== undefined) data[key] = body[key];
  });
  if (data.resume === '' || data.resume === 'none') data.resume = null;
  if (data.status && !STATUSES.includes(data.status)) {
    const err = new Error(`Status must be one of: ${STATUSES.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }
  return data;
}

exports.createJob = asyncHandler(async (req, res) => {
  const data = pickFields(req.body);
  if (!data.company || !data.title) {
    return res.status(400).json({ message: 'Company and job title are required' });
  }
  await assertOwnResume(req.user._id, data.resume);

  const job = await JobApplication.create({ ...data, user: req.user._id });
  const populated = await job.populate('resume', 'name version fileUrl');
  res.status(201).json({ job: populated });
});

exports.getJobs = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.status && STATUSES.includes(req.query.status)) {
    filter.status = req.query.status;
  }
  const jobs = await JobApplication.find(filter)
    .populate('resume', 'name version fileUrl')
    .sort({ dateApplied: -1, createdAt: -1 });
  res.json({ jobs });
});

exports.getJob = asyncHandler(async (req, res) => {
  const job = await JobApplication.findOne({ _id: req.params.id, user: req.user._id }).populate(
    'resume',
    'name version fileUrl fileType createdAt'
  );
  if (!job) {
    return res.status(404).json({ message: 'Application not found' });
  }
  res.json({ job });
});

exports.updateJob = asyncHandler(async (req, res) => {
  const job = await JobApplication.findOne({ _id: req.params.id, user: req.user._id });
  if (!job) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const data = pickFields(req.body);
  await assertOwnResume(req.user._id, data.resume);

  Object.assign(job, data);
  await job.save();
  const populated = await job.populate('resume', 'name version fileUrl');
  res.json({ job: populated });
});

exports.deleteJob = asyncHandler(async (req, res) => {
  const job = await JobApplication.findOne({ _id: req.params.id, user: req.user._id });
  if (!job) {
    return res.status(404).json({ message: 'Application not found' });
  }
  await job.deleteOne();
  res.json({ message: 'Application deleted' });
});

exports.getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [total, thisMonth, interviews, rejected, selected, resumes, recent] = await Promise.all([
    JobApplication.countDocuments({ user: userId }),
    JobApplication.countDocuments({ user: userId, createdAt: { $gte: startOfMonth } }),
    JobApplication.countDocuments({ user: userId, status: 'Interview' }),
    JobApplication.countDocuments({ user: userId, status: 'Rejected' }),
    JobApplication.countDocuments({ user: userId, status: 'Selected' }),
    Resume.countDocuments({ user: userId }),
    JobApplication.find({ user: userId })
      .populate('resume', 'name version')
      .sort({ updatedAt: -1 })
      .limit(6)
  ]);

  res.json({
    stats: {
      total,
      thisMonth,
      interviews,
      rejected,
      selected,
      resumes
    },
    recent
  });
});
