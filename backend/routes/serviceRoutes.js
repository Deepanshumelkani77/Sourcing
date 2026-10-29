const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  updateServiceStatus,
  getServicesByPhase
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/adminAuthMiddleware');

// Public routes (for frontend)
router.get('/phase/:phaseId', getServicesByPhase);
router.get('/:id', getServiceById);
router.get('/', getAllServices);

// Admin routes (protected)
router.post('/', protect, authorize('admin'), createService);
router.put('/:id', protect, authorize('admin'), updateService);
router.patch('/:id/status', protect, authorize('admin'), updateServiceStatus);
router.delete('/:id', protect, authorize('admin'), deleteService);

module.exports = router;
