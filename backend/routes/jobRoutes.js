const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getActiveJobs,
  getJobById,
  updateJob,
  deleteJob
} = require('../controllers/jobController');

// Public routes
router.get('/active', getActiveJobs);
router.get('/:id', getJobById);

// Admin routes (to be protected with admin middleware)
router.post('/', createJob);
router.get('/', getAllJobs);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

module.exports = router;
