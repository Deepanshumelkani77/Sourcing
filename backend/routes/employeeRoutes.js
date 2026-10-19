const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  toggleEmployeeStatus,
  getEmployeeStats
} = require('../controllers/employeeController');

const { protectAdmin, authorize } = require('../middleware/authMiddleware');

// All routes require admin authentication and main admin role
router.use(protectAdmin);
router.use((req, res, next) => {
  if (req.admin.role !== 'main_admin') {
    return res.status(403).json({
      success: false,
      message: 'Only main admin can access employee management'
    });
  }
  next();
});

router.get('/stats', getEmployeeStats);
router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
router.patch('/:id/toggle-status', toggleEmployeeStatus);

module.exports = router;
