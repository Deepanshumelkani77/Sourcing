const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const passport = require("passport");

const User = require("../models/User");
const OTP = require("../models/OTP");

const generateOTP = require("../utils/generateOTP");

const {
  sendSignupOTPEmail,
  sendPasswordResetEmail,
} = require("../services/emailService");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9]{7,15}$/;

const createToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    domain: process.env.COOKIE_DOMAIN || undefined,
  });
};

const sendSignupOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.findOneAndUpdate(
      { email: normalizedEmail },
      { otp, otpExpires },
      { upsert: true, new: true }
    );

    await sendSignupOTPEmail(normalizedEmail, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("sendSignupOTP:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to send OTP",
    });
  }
};

const verifySignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const otpRecord = await OTP.findOne({ email: normalizedEmail });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP",
      });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (otpRecord.otpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP",
      });
    }

    await OTP.deleteOne({ email: normalizedEmail });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("verifySignupOTP:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP",
    });
  }
};

const signup = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      phone,
      password,
      emailVerified,
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      middleName,
      lastName,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      emailVerified: emailVerified || false,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("signup:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create account",
    });
  }
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

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user._id);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        role: "customer",
      },
    });
  } catch (error) {
    console.error("login:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to login",
    });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    domain: process.env.COOKIE_DOMAIN || undefined,
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = await User.findById(req.user._id).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        role: "customer",
      },
    });
  } catch (error) {
    console.error("getMe:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch user details",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    await sendPasswordResetEmail(normalizedEmail, resetToken);

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("forgotPassword:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to send reset link",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("resetPassword:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to reset password",
    });
  }
};

const googleCallback = async (req, res) => {
  try {
    // Passport puts the user in req.user after successful authentication
    // We don't use req.login() since we're using JWT tokens, not sessions
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    const token = createToken(user._id);
    setAuthCookie(res, token);

    // Redirect with token in URL for cross-domain cookie handling
    return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error("googleCallback:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};

const facebookCallback = async (req, res) => {
  try {
    // Passport puts the user in req.user after successful authentication
    // We don't use req.login() since we're using JWT tokens, not sessions
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    const token = createToken(user._id);
    setAuthCookie(res, token);

    // Redirect with token in URL for cross-domain cookie handling
    return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error("facebookCallback:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};

module.exports = {
  sendSignupOTP,
  verifySignupOTP,
  signup,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  googleCallback,
  facebookCallback,
};
