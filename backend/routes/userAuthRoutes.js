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
  googleCallback,
} = require("../controllers/userAuthController");
const { protectUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/send-signup-otp", sendSignupOTP);
router.post("/verify-signup-otp", verifySignupOTP);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectUser, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  googleCallback
);

module.exports = router;
