const express = require('express');
const { protect } = require('../middleware/auth');
const { resumeUpload } = require('../middleware/upload');
const {
  createResume,
  getResumes,
  getResume,
  deleteResume,
  downloadResume
} = require('../controllers/resumeController');

const router = express.Router();

router.use(protect);

router.post('/', resumeUpload.single('resume'), createResume);
router.get('/', getResumes);
router.get('/:id/download', downloadResume);
router.get('/:id', getResume);
router.delete('/:id', deleteResume);

module.exports = router;
