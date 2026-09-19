const multer = require('multer');

const storage = multer.memoryStorage();
const MAX_SIZE = 5 * 1024 * 1024;

function fileError(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

const resumeUpload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(fileError('Only PDF files are allowed for resumes'), false);
    }
  }
});

const tailorUpload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'resume' && file.mimetype !== 'application/pdf') {
      return cb(fileError('Resume must be a PDF file'), false);
    }
    if (
      file.fieldname === 'jdFile' &&
      !['application/pdf', 'text/plain'].includes(file.mimetype)
    ) {
      return cb(fileError('Job description files must be PDF or TXT'), false);
    }
    cb(null, true);
  }
});

module.exports = { resumeUpload, tailorUpload };
