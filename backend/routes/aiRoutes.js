const express = require('express');
const { protect } = require('../middleware/auth');
const { tailorUpload } = require('../middleware/upload');
const { tailor, downloadTailored } = require('../controllers/aiController');

const router = express.Router();

router.use(protect);

router.post(
  '/tailor',
  tailorUpload.fields([
    { name: 'jdFile', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
  ]),
  tailor
);
router.post('/download', downloadTailored);

module.exports = router;
