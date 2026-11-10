const express = require("express");
const router = express.Router();
const {
  createSourcingRequest,
  getSourcingRequests,
  getSourcingRequest,
  updateSourcingRequest,
  deleteSourcingRequest,
  getSourcingRequestStats,
} = require("../controllers/sourcingRequestController");

const { protect, authorize, protectUser, requireApproved } = require("../middleware/authMiddleware");

// Requires an approved customer account
router.post("/", protectUser, requireApproved, createSourcingRequest);

// Admin routes
router.get("/", protect, authorize("admin"), getSourcingRequests);
router.get("/stats", protect, authorize("admin"), getSourcingRequestStats);
router.get("/:id", protect, authorize("admin"), getSourcingRequest);
router.put("/:id", protect, authorize("admin"), updateSourcingRequest);
router.delete("/:id", protect, authorize("admin"), deleteSourcingRequest);

module.exports = router;
