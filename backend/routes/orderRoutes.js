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
router.post("/", protectAdmin, authorize("admin", "main_admin", "employee"), createOrder);
router.get("/", protectAdmin, authorize("admin", "main_admin", "employee"), getAllOrders);
router.get("/:id", protectAdmin, authorize("admin", "main_admin", "employee"), getOrderById);
router.patch("/:id", protectAdmin, authorize("admin", "main_admin", "employee"), updateOrderStatus);
router.put("/:id/status", protectAdmin, authorize("admin", "main_admin", "employee"), updateOrderStatus);
router.delete("/:id", protectAdmin, authorize("admin", "main_admin", "employee"), deleteOrder);

module.exports = router;
