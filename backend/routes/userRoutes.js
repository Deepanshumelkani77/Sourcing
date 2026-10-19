const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  deleteUser
} = require('../controllers/userController');
const { protectAdmin, authorize } = require('../middleware/authMiddleware');

// Admin routes
router.route('/')
  .get(protectAdmin, authorize('admin', 'main_admin', 'employee'), getAllUsers);

router.route('/:id')
  .get(protectAdmin, authorize('admin', 'main_admin', 'employee'), getUserById)
  .delete(protectAdmin, authorize('admin', 'main_admin', 'employee'), deleteUser);

module.exports = router;
