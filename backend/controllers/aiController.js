const Resume = require('../models/Resume');
const asyncHandler = require('../utils/asyncHandler');
const { tailorResume } = require('../services/geminiService');
const { extractTextFromUpload, extractPdfTextFromUrl } = require('../services/pdfTextService');
const { buildTailoredPdf } = require('../services/pdfBuildService');

exports.tailor = asyncHandler(async (req, res) => {
  const pastedJd = (req.body.jobDescription || '').trim();
  const jdFile = req.files?.jdFile?.[0];
  const resumeFile = req.files?.resume?.[0];
  const resumeId = req.body.resumeId;

  let jobDescription = pastedJd;
  if (!jobDescription && jdFile) {
    jobDescription = await extractTextFromUpload(jdFile);
  }

  if (!jobDescription) {
    return res.status(400).json({
      message: 'Provide a job description by pasting text or uploading a PDF/TXT file'
    });
  }

  let resumeText = '';
  if (resumeFile) {
    resumeText = await extractTextFromUpload(resumeFile);
  } else if (resumeId) {
    const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Selected resume was not found' });
    }
    resumeText = await extractPdfTextFromUrl(resume.fileUrl);
  } else {
    return res.status(400).json({
      message: 'Select a resume from your library or upload a PDF'
    });
  }

  if (!resumeText) {
    return res.status(400).json({
      message: 'Could not read text from the resume. Try another PDF.'
    });
  }

  const result = await tailorResume(jobDescription, resumeText);
  res.json(result);
});

exports.downloadTailored = asyncHandler(async (req, res) => {
  const tailoredResume = req.body.tailoredResume;
  if (!tailoredResume) {
    return res.status(400).json({ message: 'Nothing to download yet' });
  }

  const buffer = await buildTailoredPdf(tailoredResume);
  const safeName = (tailoredResume.name || 'tailored-resume').replace(/[^\w\s-]/g, '').trim();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${safeName || 'tailored-resume'}.pdf"`);
  res.send(buffer);
});
