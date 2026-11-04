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

// Public routes (no authentication required) - Allow CORS for all origins
router.get("/published", (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  getPublishedBlogs(req, res, next);
});

router.get("/slug/:slug", (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  getBlogBySlug(req, res, next);
});

// Admin routes (protected by authentication)
router.get("/", protect, getAllBlogs);
router.get("/:id", protect, getBlogById);
router.post("/", protect, createBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

module.exports = router;
