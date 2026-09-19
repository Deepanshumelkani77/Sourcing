const express = require("express");
const passport = require("passport");

const {
  sendSignupOTP,
  verifySignupOTP,
  signup,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  googleAuthCallback,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Signup OTP
router.post(
  "/send-signup-otp",
  sendSignupOTP
);

router.post(
  "/verify-signup-otp",
  verifySignupOTP
);


// Account
router.post(
  "/signup",
  signup
);

router.post(
  "/login",
  login
);

router.post(
  "/logout",
  logout
);

router.get(
  "/me",
  authMiddleware,
  getMe
);


// Password
router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password/:token",
  resetPassword
);


// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["openid", "profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
  }),
  googleAuthCallback
);

module.exports = router;
