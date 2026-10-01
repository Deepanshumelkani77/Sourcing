const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const createToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const setAdminCookie = (res, token) => {
  res.cookie("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const admin = await Admin.findOne({ email: normalizedEmail }).select(
      "+password"
    );

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Admin account is deactivated",
      });
    }

    const passwordCorrect = await admin.comparePassword(password);

    if (!passwordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = createToken(admin._id);
    setAdminCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phone,
        role: "admin",
        department: admin.department,
      },
    });
  } catch (error) {
    console.error("admin login:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to login",
    });
  }
};

const logout = async (req, res) => {
  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phone,
        role: "admin",
        department: admin.department,
      },
    });
  } catch (error) {
    console.error("getMe:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch admin details",
    });
  }
};

module.exports = {
  login,
  logout,
  getMe,
};
