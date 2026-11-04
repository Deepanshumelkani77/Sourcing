const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  getPublishedBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { protect } = require("../middleware/adminAuthMiddleware");

// Public routes (no authentication required)
router.get("/published", getPublishedBlogs);
router.get("/slug/:slug", getBlogBySlug);

// Admin routes (protected by authentication)
router.get("/", protect, getAllBlogs);
router.get("/:id", protect, getBlogById);
router.post("/", protect, createBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

module.exports = router;
