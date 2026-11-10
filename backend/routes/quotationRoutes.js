const express = require("express");
const { submitQuotation, getQuotations, getQuotationById, updateQuotationStatus } = require("../controllers/quotationController");
const { protectUser, protectAdmin, requireApproved } = require("../middleware/authMiddleware");

const router = express.Router();

// Submit quotation - requires an approved customer account
router.post("/submit", protectUser, requireApproved, submitQuotation);

// Admin routes
router.get("/", protectAdmin, getQuotations);
router.get("/:id", protectAdmin, getQuotationById);
router.patch("/:id/status", protectAdmin, updateQuotationStatus);

module.exports = router;
