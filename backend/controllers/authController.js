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
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};


/*
|--------------------------------------------------------------------------
| SEND SIGNUP OTP
|--------------------------------------------------------------------------
*/

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

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser && existingUser.emailVerified) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const otp = generateOTP();

    const otpHash = await bcrypt.hash(otp, 10);

    await OTP.deleteMany({
      email: normalizedEmail,
      purpose: "signup",
    });

    await OTP.create({
      email: normalizedEmail,
      otpHash,
      purpose: "signup",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendSignupOTPEmail(
      normalizedEmail,
      otp
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("sendSignupOTP:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send OTP. Please try again.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| VERIFY SIGNUP OTP
|--------------------------------------------------------------------------
*/

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

    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      purpose: "signup",
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(429).json({
        success: false,
        message:
          "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    const isCorrect = await bcrypt.compare(
      otp,
      otpRecord.otpHash
    );

    if (!isCorrect) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        success: false,
        message: "Incorrect OTP",
      });
    }

    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    console.error("verifySignupOTP:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP",
    });
  }
};


/*
|--------------------------------------------------------------------------
| SIGNUP
|--------------------------------------------------------------------------
*/

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

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    if (emailVerified !== true) {
      return res.status(400).json({
        success: false,
        message:
          "Please verify your email before creating your account",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser && existingUser.emailVerified) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    let user;

    if (existingUser) {
      existingUser.firstName = firstName.trim();
      existingUser.middleName =
        middleName?.trim() || "";
      existingUser.lastName = lastName.trim();
      existingUser.phone = phone.trim();
      existingUser.password = hashedPassword;
      existingUser.emailVerified = true;

      user = await existingUser.save();

    } else {
      user = await User.create({
        firstName: firstName.trim(),
        middleName: middleName?.trim() || "",
        lastName: lastName.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        password: hashedPassword,
        emailVerified: true,
      });
    }

    const token = createToken(user._id);

    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",

      user: {
        id: user._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        role: user.role,
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


/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email before logging in",
      });
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      user.password
    );

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
        role: user.role,
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


/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

const logout = async (req, res) => {

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};


/*
|--------------------------------------------------------------------------
| GET CURRENT USER
|--------------------------------------------------------------------------
*/

const getMe = async (req, res) => {

  return res.status(200).json({
    success: true,
    user: req.user,
  });
};


/*
|--------------------------------------------------------------------------
| FORGOT PASSWORD
|--------------------------------------------------------------------------
*/

const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists, a reset link has been sent.",
      });
    }

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken =
      resetTokenHash;

    user.resetPasswordExpires =
      new Date(
        Date.now() + 30 * 60 * 1000
      );

    await user.save();

    const resetUrl =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendPasswordResetEmail(
      normalizedEmail,
      resetUrl
    );

    return res.status(200).json({
      success: true,
      message:
        "If an account exists, a reset link has been sent.",
    });

  } catch (error) {

    console.error(
      "forgotPassword:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to process password reset request",
    });
  }
};


/*
|--------------------------------------------------------------------------
| RESET PASSWORD
|--------------------------------------------------------------------------
*/

const resetPassword = async (req, res) => {
  try {

    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters",
      });
    }

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Reset link is invalid or expired",
      });
    }

    user.password = await bcrypt.hash(
      password,
      12
    );

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully",
    });

  } catch (error) {

    console.error(
      "resetPassword:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to reset password",
    });
  }
};


/*
|--------------------------------------------------------------------------
| GOOGLE AUTH
|--------------------------------------------------------------------------
*/

const googleAuth = passport.authenticate("google", {
  scope: ["openid", "profile", "email"],
});

const googleAuthCallback = (req, res) => {
  try {
    const token = createToken(req.user._id);

    setAuthCookie(res, token);

    return res.redirect(
      `${process.env.FRONTEND_URL}/`
    );
  } catch (error) {
    console.error("Google callback error:", error);

    return res.redirect(
      `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
    );
  }
};


/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  sendSignupOTP,
  verifySignupOTP,
  signup,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleAuthCallback,
};