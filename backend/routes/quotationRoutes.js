const express = require("express");
const { submitQuotation, getQuotations, getQuotationById, updateQuotationStatus } = require("../controllers/quotationController");
const { protectUser, protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public route - submit quotation (works for both logged in and guest users)
router.post("/submit", protectUser, submitQuotation);

// Admin routes
router.get("/", protectAdmin, getQuotations);
router.get("/:id", protectAdmin, getQuotationById);
router.patch("/:id/status", protectAdmin, updateQuotationStatus);

module.exports = router;
