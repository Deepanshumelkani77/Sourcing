const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

// User-specific protection - checks token cookie and Authorization header
const protectUser = async (req, res, next) => {
  try {
    // Try to get token from cookie first, then from Authorization header
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = 'customer';
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};

// Admin-specific protection - checks admin_token cookie and Authorization header
const protectAdmin = async (req, res, next) => {
  try {
    // Try to get token from cookie first, then from Authorization header
    const token = req.cookies.admin_token || req.headers.authorization?.replace('Bearer ', '');

    console.log('protectAdmin - Token from cookie:', !!req.cookies.admin_token);
    console.log('protectAdmin - Token from header:', !!req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.userId).select("-password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Admin account is deactivated",
      });
    }

    req.admin = admin;
    req.user = admin;
    req.user.role = admin.role || 'admin';

    console.log('protectAdmin - Admin role:', req.user.role);

    next();
  } catch (error) {
    console.error('protectAdmin error:', error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};

// Legacy protect - checks both tokens (for backward compatibility)
const protect = async (req, res, next) => {
  try {
    const adminToken = req.cookies.admin_token;
    const userToken = req.cookies.token;
    
    const token = adminToken || userToken;
    const isAdmin = !!adminToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;

    if (isAdmin) {
      user = await Admin.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Admin not found",
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Admin account is deactivated",
        });
      }

      req.admin = user;
      req.user = user;
      req.user.role = user.role || 'admin';
      return next();
    }

    user = await User.findById(decoded.userId).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = 'customer';
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    // Check both user.role and admin.role for flexibility
    const userRole = req.user?.role || req.admin?.role;

    console.log('authorize - Required roles:', roles);
    console.log('authorize - User role:', userRole);
    console.log('authorize - req.user:', req.user);
    console.log('authorize - req.admin:', req.admin);

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
    next();
  };
};

module.exports = { protect, protectUser, protectAdmin, authorize };
