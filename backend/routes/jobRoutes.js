const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getDashboard
} = require('../controllers/jobController');

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboard);
router.post('/', createJob);
router.get('/', getJobs);
router.get('/:id', getJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

module.exports = router;
