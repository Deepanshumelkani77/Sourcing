const express = require('express');
const router = express.Router();
const { createIssue, getIssues, getIssueById, updateIssueStatus } = require('../controllers/issueController');
const { protectUser } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 3 // Max 3 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// User routes
router.post('/', protectUser, upload.array('files', 3), createIssue);

// Admin routes (to be protected with admin middleware)
router.get('/', getIssues);
router.get('/:id', getIssueById);
router.put('/:id/status', updateIssueStatus);

module.exports = router;
