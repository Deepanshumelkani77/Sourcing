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
  .get(protectAdmin, authorize('admin', 'main_admin', 'employee'), getAllContainers)
  .post(protectAdmin, authorize('admin', 'main_admin', 'employee'), createContainer);

router.route('/available-orders')
  .get(protectAdmin, authorize('admin', 'main_admin', 'employee'), getAvailableOrders);

// Customer routes (must be before /:id to avoid route conflicts)
router.route('/my-containers')
  .get(protectUser, getUserContainers);

router.route('/:id')
  .get(protectAdmin, authorize('admin', 'main_admin', 'employee'), getContainerById)
  .put(protectAdmin, authorize('admin', 'main_admin', 'employee'), updateContainer)
  .delete(protectAdmin, authorize('admin', 'main_admin', 'employee'), deleteContainer);

router.route('/:id/status')
  .put(protectAdmin, authorize('admin', 'main_admin', 'employee'), updateContainerStatus);

module.exports = router;
