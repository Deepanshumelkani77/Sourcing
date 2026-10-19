const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// @desc    Get all employees (main admin only)
// @route   GET /api/admin/employees
// @access  Private/Admin (main admin only)
exports.getEmployees = async (req, res) => {
  try {
    // Role check is done in middleware

    const { department, isActive } = req.query;
    let query = { role: 'employee' };

    if (department) query.department = department;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const employees = await Admin.find(query)
      .select('-password')
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single employee
// @route   GET /api/admin/employees/:id
// @access  Private/Admin (main admin only)
exports.getEmployee = async (req, res) => {
  try {

    const employee = await Admin.findById(req.params.id)
      .select('-password')
      .populate('createdBy', 'firstName lastName email');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    if (employee.role === 'main_admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot view main admin details'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new employee (main admin only)
// @route   POST /api/admin/employees
// @access  Private/Admin (main admin only)
exports.createEmployee = async (req, res) => {
  try {

    const { firstName, lastName, email, password, phone, department, permissions } = req.body;

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const employee = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: 'employee',
      department,
      permissions: permissions || [],
      createdBy: req.admin._id
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: {
        id: employee._id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
        department: employee.department,
        permissions: employee.permissions,
        isActive: employee.isActive
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update employee (main admin only)
// @route   PUT /api/admin/employees/:id
// @access  Private/Admin (main admin only)
exports.updateEmployee = async (req, res) => {
  try {

    let employee = await Admin.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    if (employee.role === 'main_admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot update main admin'
      });
    }

    // Don't allow changing role
    if (req.body.role && req.body.role !== 'employee') {
      return res.status(400).json({
        success: false,
        message: 'Cannot change employee role'
      });
    }

    // Hash password if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    employee = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete employee (main admin only)
// @route   DELETE /api/admin/employees/:id
// @access  Private/Admin (main admin only)
exports.deleteEmployee = async (req, res) => {
  try {

    const employee = await Admin.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    if (employee.role === 'main_admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete main admin'
      });
    }

    await Admin.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle employee active status
// @route   PATCH /api/admin/employees/:id/toggle-status
// @access  Private/Admin (main admin only)
exports.toggleEmployeeStatus = async (req, res) => {
  try {

    const employee = await Admin.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    if (employee.role === 'main_admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot change main admin status'
      });
    }

    employee.isActive = !employee.isActive;
    await employee.save();

    res.status(200).json({
      success: true,
      message: `Employee ${employee.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: employee._id,
        isActive: employee.isActive
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get employee statistics
// @route   GET /api/admin/employees/stats
// @access  Private/Admin (main admin only)
exports.getEmployeeStats = async (req, res) => {
  try {
    if (req.admin.role !== 'main_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only main admin can view statistics'
      });
    }

    const totalEmployees = await Admin.countDocuments({ role: 'employee' });
    const activeEmployees = await Admin.countDocuments({ role: 'employee', isActive: true });
    const inactiveEmployees = await Admin.countDocuments({ role: 'employee', isActive: false });

    // Employees by department
    const byDepartment = await Admin.aggregate([
      { $match: { role: 'employee' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent employees
    const recentEmployees = await Admin.find({ role: 'employee' })
      .select('firstName lastName email department isActive createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        byDepartment,
        recentEmployees
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
