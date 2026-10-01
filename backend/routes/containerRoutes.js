const express = require('express');
const router = express.Router();
const {
  createContainer,
  getAllContainers,
  getContainerById,
  updateContainerStatus,
  updateContainer,
  deleteContainer,
  getUserContainers,
  getAvailableOrders
} = require('../controllers/containerController');
const { protectAdmin, protectUser, authorize } = require('../middleware/authMiddleware');

// Admin routes
router.route('/')
  .get(protectAdmin, authorize('admin'), getAllContainers)
  .post(protectAdmin, authorize('admin'), createContainer);

router.route('/available-orders')
  .get(protectAdmin, authorize('admin'), getAvailableOrders);

// Customer routes (must be before /:id to avoid route conflicts)
router.route('/my-containers')
  .get(protectUser, getUserContainers);

router.route('/:id')
  .get(protectAdmin, authorize('admin'), getContainerById)
  .put(protectAdmin, authorize('admin'), updateContainer)
  .delete(protectAdmin, authorize('admin'), deleteContainer);

router.route('/:id/status')
  .put(protectAdmin, authorize('admin'), updateContainerStatus);

module.exports = router;
