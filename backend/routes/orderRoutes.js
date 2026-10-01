const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getUserOrders,
} = require("../controllers/orderController");
const { protectAdmin, protectUser, authorize } = require("../middleware/authMiddleware");

// User routes (must be before /:id to avoid route conflicts)
router.get("/my-orders", protectUser, getUserOrders);

// Admin routes
router.post("/", protectAdmin, authorize("admin"), createOrder);
router.get("/", protectAdmin, authorize("admin"), getAllOrders);
router.get("/:id", protectAdmin, authorize("admin"), getOrderById);
router.patch("/:id", protectAdmin, authorize("admin"), updateOrderStatus);
router.put("/:id/status", protectAdmin, authorize("admin"), updateOrderStatus);
router.delete("/:id", protectAdmin, authorize("admin"), deleteOrder);

module.exports = router;
