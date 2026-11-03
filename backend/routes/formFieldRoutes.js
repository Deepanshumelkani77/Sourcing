const express = require('express');
const router = express.Router();
const {
  getFieldConfigurations,
  createFieldConfiguration,
  updateFieldConfiguration,
  deleteFieldConfiguration,
  initializeDefaultFields
} = require('../controllers/formFieldController');
const { protectAdmin, authorize } = require('../middleware/authMiddleware');

// Get field configurations for a form type (all authenticated users)
router.get('/:formType', protectAdmin, getFieldConfigurations);

// Initialize default fields (main_admin only)
router.post('/:formType/initialize', protectAdmin, authorize('main_admin'), initializeDefaultFields);

// Create field configuration (main_admin only)
router.post('/', protectAdmin, authorize('main_admin'), createFieldConfiguration);

// Update field configuration (main_admin only)
router.put('/:id', protectAdmin, authorize('main_admin'), updateFieldConfiguration);

// Delete field configuration (main_admin only)
router.delete('/:id', protectAdmin, authorize('main_admin'), deleteFieldConfiguration);

module.exports = router;
