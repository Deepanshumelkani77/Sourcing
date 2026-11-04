const Blog = require("../models/Blog");
const Admin = require("../models/Admin");

// Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 100);
};

// Helper function to calculate reading time
const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

// Get all blogs (admin)
const getAllBlogs = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    const filter = { isDeleted: false };

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    const blogs = await Blog.find(filter)
      .populate("author", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("getAllBlogs:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch blogs",
    });
  }
};

// Get published blogs (public)
const getPublishedBlogs = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = { status: "published", isDeleted: false };

    if (category) filter.category = category;
    if (featured === "true") filter.isFeatured = true;

    const blogs = await Blog.find(filter)
      .populate("author", "firstName lastName")
      .select("title slug excerpt coverImage coverImageAlt category tags author publishedAt readingTime isFeatured")
      .sort({ publishedAt: -1 });

    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("getPublishedBlogs:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch blogs",
    });
  }
};

// Get single blog by slug (public)
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug, status: "published", isDeleted: false })
      .populate("author", "firstName lastName email");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("getBlogBySlug:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch blog",
    });
  }
};

// Get single blog by ID (admin)
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findOne({ _id: id, isDeleted: false })
      .populate("author", "firstName lastName email");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("getBlogById:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch blog",
    });
  }
};

// Create new blog
const createBlog = async (req, res) => {
  try {
    const blogData = req.body;

    // Set author to logged-in admin
    blogData.author = req.user._id;

    // Generate slug if not provided
    if (!blogData.slug) {
      blogData.slug = generateSlug(blogData.title);
    }

    // Calculate reading time
    if (blogData.content) {
      blogData.readingTime = calculateReadingTime(blogData.content);
    }

    // Set publishedAt if status is published and not already set
    if (blogData.status === "published" && !blogData.publishedAt) {
      blogData.publishedAt = new Date();
    }

    const blog = await Blog.create(blogData);

    return res.status(201).json({
      success: true,
      blog,
      message: "Blog created successfully",
    });
  } catch (error) {
    console.error("createBlog:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists. Please use a different slug.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Unable to create blog",
    });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blogData = req.body;

    // Ensure author is the logged-in admin
    blogData.author = req.user._id;

    // Generate slug if title changed and slug not provided
    if (blogData.title && !blogData.slug) {
      blogData.slug = generateSlug(blogData.title);
    }

    // Recalculate reading time if content changed
    if (blogData.content) {
      blogData.readingTime = calculateReadingTime(blogData.content);
    }

    // Set publishedAt if status changed to published
    if (blogData.status === "published" && !blogData.publishedAt) {
      blogData.publishedAt = new Date();
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      blogData,
      { new: true, runValidators: true }
    ).populate("author", "firstName lastName email");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      blog,
      message: "Blog updated successfully",
    });
  } catch (error) {
    console.error("updateBlog:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists. Please use a different slug.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Unable to update blog",
    });
  }
};

// Delete blog (soft delete)
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("deleteBlog:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete blog",
    });
  }
};

module.exports = {
  getAllBlogs,
  getPublishedBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
