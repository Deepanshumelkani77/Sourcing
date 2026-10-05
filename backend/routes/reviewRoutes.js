const express = require("express");
const { submitReview, getReviews, getApprovedReviews, getReviewById, updateReviewStatus, deleteReview } = require("../controllers/reviewController");
const { protectUser, protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public route - get approved reviews
router.get("/approved", getApprovedReviews);

// User route - submit review
router.post("/submit", protectUser, submitReview);

// Admin routes
router.get("/", protectAdmin, getReviews);
router.get("/:id", protectAdmin, getReviewById);
router.patch("/:id/status", protectAdmin, updateReviewStatus);
router.delete("/:id", protectAdmin, deleteReview);

module.exports = router;
